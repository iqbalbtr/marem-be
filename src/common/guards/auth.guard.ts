
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserToken } from '../models/token.model';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators/role.decorator';
import { PrismaService } from '@database/prisma.service';
import { Cache } from '@nestjs/cache-manager';
import { SKIP_AUTH_KEY } from '@decorators/skip-auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request & { user?: UserToken } = context.switchToHttp().getRequest();

    // Skip guard handler
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    const roles = this.reflector.get(Role, context.getHandler());

    // Error return if token is not found
    if (!token) {
      throw new UnauthorizedException('access denied');
    }

    try {

      // Get token cache
      let tokenInCahce: UserToken | undefined = await this.cacheManager.get(token);

      // Login to handle auth and saving auth to cache
      if (!tokenInCahce) {
        const payload: UserToken = tokenInCahce ?? await this.jwtService.verifyAsync(
          token
        );

   
        const existToken = await this.prismaService.user_tokens.findFirst({
          where: {
            id: payload.uuid
          },
          include: {
            user: true
          }
        })

        if (!existToken || existToken.user.email !== payload.email) {
          throw new UnauthorizedException('access denied');
        }

        // saving to cache
        const jwtExp = (payload.exp * 1000 - Date.now())
        const authExp = 1000 * 60 * 60 * 3
        if (jwtExp > 0) await this.cacheManager.set(token, payload, (jwtExp < authExp ? jwtExp : authExp))

        tokenInCahce = payload
      }

      request['user'] = tokenInCahce;

      /**
       * 
       * Verify role if roles exist on controller
       * make sure that route there are auth guard and regis
       * before role decorator
       */
      if (roles) {
        const roleValid = typeof roles === 'string' ? [roles]: roles
        this.matchRoles(tokenInCahce.role, roleValid);
      }

    } catch (e: any) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private matchRoles(currentRole: string, roles: string[]): boolean {

    if (roles.indexOf(currentRole) == -1)
      throw new UnauthorizedException("role access denied");

    return true
  }
}
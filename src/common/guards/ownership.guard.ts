import { CanActivate, ExecutionContext, ForbiddenException, Injectable, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionHelper } from 'src/helpers/permission.helper';
import { CHECK_OWNERSHIP_KEY, OwnershipOptions } from '../decorators/check-ownership.decorator';
import { UserToken } from '@models/token.model';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.get<OwnershipOptions>(CHECK_OWNERSHIP_KEY, context.getHandler());

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserToken;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (options.skipRoles && options.skipRoles.includes(user.role)) {
      return true;
    }

    let resourceId: string;

    switch (options.source) {
      case 'body':
        resourceId = request.body[options.key];
        break;
      case 'query':
        resourceId = request.query[options.key];
        break;
      case 'params':
      default:
        resourceId = request.params[options.key];
        break;
    }

    if (!resourceId) {
      throw new BadRequestException(`Resource ID '${options.key}' not found in request ${options.source}`);
    }

    const isAllowed = PermissionHelper.canManageResource(user, resourceId);

    if (!isAllowed) {
      throw new ForbiddenException('You do not have permission to manage this resource');
    }

    return true;
  }
}
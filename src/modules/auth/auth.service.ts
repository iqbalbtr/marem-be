import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@database/prisma.service';
import { Cache } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserToken } from '@models/token.model';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        @Inject('CACHE_MANAGER') private readonly cacheManager: Cache
    ) { }

    async loginUser(email: string, password: string) {

        // Akses model 'users'
        const user = await this.prismaService.users.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('invalid credentials');
        }

        const payload = {
            uuid: uuidv4(),
            email: user.email,
            role: user.role,
            name: user.name
        } as UserToken

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d'
        });

        // Akses model 'user_tokens'
        await this.prismaService.user_tokens.create({
            data: {
                id: payload.uuid,
                user_id: user.id,      // Field snake_case
                expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                last_logged: new Date() // Field snake_case
            }
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            is_active: user.is_active,     // Field snake_case
            is_verified: user.is_verified, // Field snake_case
            token: token
        }
    }

    async logoutUser(user: UserToken) {

        // Akses model 'user_tokens'
        const tokenExist = await this.prismaService.user_tokens.findFirst({
            where: {
                id: user.uuid
            }
        });

        if (!tokenExist) {
            throw new NotFoundException('token not found');
        }

        await this.prismaService.user_tokens.delete({
            where: {
                id: user.uuid
            }
        });
    }

    async getCurrentSession(user: UserToken) {
        return user
    }
}
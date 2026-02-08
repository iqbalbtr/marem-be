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
            name: user.name,
            user_id: user.id
        } as UserToken

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d'
        });

        await this.prismaService.user_tokens.create({
            data: {
                id: payload.uuid,
                user_id: user.id,     
                expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                last_logged: new Date()
            }
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            is_active: user.is_active,    
            is_verified: user.is_verified,
            token: token
        }
    }

    async logoutUser(user: UserToken) {

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
        const userData = await this.prismaService.users.findUnique({
            where: {
                id: user.user_id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gender: true,
                is_active: true,
                is_verified: true,
                assesor_profile: true,
                participant_profile: {
                    include: {
                        business_profile: true
                    }
                }
            }
        });

        if(!userData)
            throw new NotFoundException('user not found');

        return {
            ...userData
        }
    }
}
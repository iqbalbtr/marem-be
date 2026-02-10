import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { user_role } from '@prisma';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';

@Injectable()
export class CoachingService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getAllCoachingSessions(query: PaginationDto, user: UserToken) {

        const userInfo = await this.prismaService.users.findUnique({
            where: {
                id: user.user_id,
                role: user_role.participant
            },
            select: {
                participant_profile: true
            }
        });

        if (!userInfo || !userInfo.participant_profile) {
            throw new NotFoundException('User participant profile not found');
        }

        const qBuilder = PaginationHelper.getWhereQuery('coaching_session', {
            OR: [
                { classification: userInfo.participant_profile.clasification },
                { regional: userInfo.participant_profile.province },
            ]
        });

        if (query.search) {
            qBuilder.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { mentor: { name: { contains: query.search, mode: 'insensitive' } } }
            ];
        }

        const res = await PaginationHelper.createPaginationData({
            table: 'coaching_session',
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            whereQuery: qBuilder,
            orderByQuery: {
                created_at: 'desc'
            },
            includeQuery: {
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                coaching_presence: {
                    where: {
                        participant_id: user.user_id
                    },
                    select: {
                        id: true,
                        participant_id: true,
                        session_id: true,
                        status: true,
                    },
                    take: 1
                }
            }
        })

        const mappedResult = res.data.map(({ coaching_presence, ...session }) => {
            return {
                ...session,
                presence_status: coaching_presence?.[0]?.status || 'absent',
            }
        });

        return {
            ...res,
            data: mappedResult
        }
    }
}

import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';

@Injectable()
export class TeachingCoachingService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getAllCoachingSessions(query: PaginationDto, user: UserToken) {

        const qBuilder = PaginationHelper.getWhereQuery('coaching_session', {
            mentor_id: user.user_id
        });

        if (query.search) {
            qBuilder.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { mentor: { name: { contains: query.search, mode: 'insensitive' } } }
            ];
        }

        return PaginationHelper.createPaginationData({
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
                }
            }
        })
    }
}
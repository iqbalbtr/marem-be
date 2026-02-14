import { PrismaService } from '@database/prisma.service';
import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCoachingDto } from '../dto/create-coaching.dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { QueryCoachingDto } from '../dto/query-coaching.dto';
import { UserToken } from '@models/token.model';
import { PermissionHelper } from 'src/helpers/permission.helper';
import { Prisma, user_role, users } from '@prisma';

@Injectable()
export class CoachingService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async createSessionCoaching(data: CreateCoachingDto) {
        this.validateTime(data.start_time, data.end_time);

        await this.validateMentor(data.asesor_id);
        
        const createdCoaching = await this.prismaService.coaching_session.create({
            data: data
        });
        return createdCoaching;
    }

    async updateSessionCoaching(user: UserToken, coachingId: string, data: CreateCoachingDto) {
        const exist = await this.prismaService.coaching_session.findUnique({
            where: { id: coachingId }
        });

        if (!exist) {
            throw new NotFoundException('Coaching session not found');
        }

        if (['canceled', 'completed'].includes(exist.status)) {
            throw new BadRequestException('Only scheduled coaching sessions can be updated');
        }

        const canManage = PermissionHelper.canManageResource(user, exist.asesor_id!);
        if (!canManage) {
            throw new ForbiddenException('You do not have permission to update this coaching session');
        }

        if (data.asesor_id && data.asesor_id !== exist.asesor_id) {
            await this.validateMentor(data.asesor_id);
        }

        if (data.start_time || data.end_time) {
            const startTime = data.start_time || exist.start_time;
            const endTime = data.end_time || exist.end_time;
            this.validateTime(startTime, endTime);
        }

        return this.prismaService.coaching_session.update({
            where: { id: coachingId },
            data: data
        });
    }

    async deleteSessionCoaching(user: UserToken, coachingId: string) {
        const exist = await this.prismaService.coaching_session.findUnique({
            where: { id: coachingId }
        });

        if (!exist) {
            throw new NotFoundException('Coaching session not found');
        }

        const canManage = PermissionHelper.canManageResource(user, exist.asesor_id!);
        if (!canManage) {
            throw new ForbiddenException('You do not have permission to delete this coaching session');
        }

        return this.prismaService.coaching_session.delete({
            where: { id: coachingId }
        });
    }

    async getSessionCoachingById(coachingId: string) {
        const coaching = await this.prismaService.coaching_session.findUnique({
            where: { id: coachingId },
            include: {
                asesor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                    }
                }
            }
        });

        if (!coaching) {
            throw new NotFoundException('Coaching session not found');
        }

        return coaching;
    }

    async getAllCoachingSessions(query: QueryCoachingDto) {

        const qBuilder = PaginationHelper.getWhereQuery('coaching_session');

        if (query.search) {
            qBuilder.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { asesor: { name: { contains: query.search, mode: 'insensitive' } } }
            ];
        }

        if (query.classification) {
            qBuilder.classification = query.classification;
        }

        if (query.audience_target) {
            qBuilder.audience_type = query.audience_target;
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
                asesor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })
    }

    private async validateMentor(mentorId: string) {
        const count = await this.prismaService.users.count({
            where: {
                id: mentorId,
                role: {
                    in: ['asesor', 'admin'] 
                }
            }
        });

        if (count === 0) {
            throw new NotFoundException('Mentor not found or user is not a asesor');
        }
    }

    private validateTime(startTime: Date | string, endTime: Date | string) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            throw new BadRequestException('Start time must be earlier than end time');
        }
    }
}
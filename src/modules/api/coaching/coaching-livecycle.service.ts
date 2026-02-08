import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionHelper } from 'src/helpers/permission.helper';

@Injectable()
export class CoachingLivecycleService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async startCoachingSession(user: UserToken, coachingId: string) {
        const coaching = await this.getCoachingById(coachingId);
        if (coaching.status !== 'scheduled') {
            throw new NotFoundException('Only scheduled coaching sessions can be started');
        }
        if(!PermissionHelper.canManageResource(user, coaching.mentor_id!)) {
            throw new NotFoundException('You do not have permission to start this coaching session');
        }
        await this.prismaService.coaching_session.update({
            where: { id: coachingId },
            data: {
                status: 'ongoing',
                actual_start_time: new Date()
            }
        });

        return {
            url: coaching.meeting_link,
            platform: coaching.meeting_platform
        }
    }

    async endCoachingSession(user: UserToken, coachingId: string) {
        const coaching = await this.getCoachingById(coachingId);
        if (coaching.status !== 'ongoing') {
            throw new NotFoundException('Only ongoing coaching sessions can be ended');
        }
        if(!PermissionHelper.canManageResource(user, coaching.mentor_id!)) {
            throw new NotFoundException('You do not have permission to end this coaching session');
        }
        return this.prismaService.coaching_session.update({
            where: { id: coachingId },
            data: {
                status: 'completed',
                actual_end_time: new Date()
            }
        });
    }

    private async getCoachingById(coachingId: string) {
        const coaching = await this.prismaService.coaching_session.findUnique({
            where: { id: coachingId }
        });
        if (!coaching) {
            throw new NotFoundException('Coaching session not found');
        }
        return coaching;
    }
}

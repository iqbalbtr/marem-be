import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class CoachingScheduler {
    private readonly logger = new Logger(CoachingScheduler.name);

    constructor(private readonly prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleExpiredSessions() {
        const now = new Date();
        const thresholdTime = new Date(now.getTime() - 30 * 60000);

        try {
            await this.prisma.coaching_session.updateMany({
                where: {
                    status: 'scheduled',
                    end_time: {
                        lt: thresholdTime,
                    },
                    actual_start_time: null,
                },
                data: {
                    status: 'canceled',
                },
            });

        } catch (error) {
            this.logger.error('Failed to cleanup sessions', error);
        }
    }
}
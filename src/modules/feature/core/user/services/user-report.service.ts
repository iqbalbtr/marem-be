import { PrismaService } from "@database/prisma.service";
import { NotFoundException, Injectable } from "@nestjs/common";
import { coaching_presence, coaching_session } from "@prisma";

@Injectable()
export class UserReportService {

    private readonly MIN_COACHING_ATTENDANCE = 3;
    private readonly MIN_PASSING_SCORE = 60;

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getUserReport(userId: string, asesor_id?: string) {
        const user = await this.prismaService.users.findUnique({
            where: { id: userId, role: 'participant', participant_profile: { asesor_id } },
            select: {
                id: true, name: true, participant_profile: true
            }
        });

        if (!user || !user.participant_profile) {
            throw new NotFoundException('User or profile not found');
        }

        const coachingSessions = await this.prismaService.coaching_session.findMany({
            where: {
                audience_type: 'participant',
                stage: user.participant_profile.stage,
                OR: [
                    { coaching_type: 'classification', classification: user.participant_profile.clasification },
                    { coaching_type: 'regional', regional: user.participant_profile.province }
                ],
            },
            include: {
                coaching_presence: {
                    where: { participant_id: userId }
                }
            }
        });

        const coachingReport = this.calculateCoachingStats(coachingSessions);

        const courses = await this.prismaService.courses.findMany({
            where: {
                stage: user.participant_profile.stage,
                OR: [
                    { course_type: 'elective', classification: user.participant_profile.clasification },
                    { course_type: 'mandatory', regional: user.participant_profile.province }
                ],
            },
            select: { id: true, title: true }
        });

        const avgGradeData = await this.prismaService.course_item_submissions.groupBy({
            by: ['course_id'],
            _avg: { score: true },
            where: {
                user_id: userId,
                status: 'graded',
                course_id: { in: courses.map(c => c.id) }
            }
        });

        const totalScore = avgGradeData.reduce((acc, curr) => acc + (curr._avg.score || 0), 0);
        const finalScore = avgGradeData.length > 0 ? (totalScore / avgGradeData.length) : 0;

        return {
            user: {
                name: user.name,
                id: user.id
            },
            report: {
                coaching: coachingReport,
                course: {
                    average_score: parseFloat(finalScore.toFixed(2)),
                    is_passed_score: finalScore >= this.MIN_PASSING_SCORE,
                    total_courses_completed: avgGradeData.length,
                    total_courses_assigned: courses.length,
                    details: avgGradeData.map(course => ({
                        course_id: course.course_id,
                        title: courses.find(c => c.id === course.course_id)?.title || 'Unknown Course',
                        average_score: parseFloat((course._avg.score || 0).toFixed(2)),
                    }))
                },
                final_status: (finalScore >= this.MIN_PASSING_SCORE && coachingReport.is_passed_attendance)
                    ? 'PASSED'
                    : 'FAILED'
            }
        };
    }


    private calculateCoachingStats(sessions: (coaching_session & { coaching_presence: coaching_presence[] })[]) {
        let attendedCount = 0;

        const details = sessions.map(session => {
            const userPresence = session.coaching_presence?.[0];

            let statusLabel: 'HADIR' | 'TIDAK HADIR' | 'BELUM DIISI' = 'BELUM DIISI';

            const isPresent = userPresence && userPresence.status === 'present';

            if (isPresent) {
                statusLabel = 'HADIR';
                attendedCount++;
            } else if (userPresence) {
                statusLabel = 'TIDAK HADIR';
            } else {
                statusLabel = 'TIDAK HADIR';
            }

            return {
                session_title: session.title,
                status: statusLabel,
                is_counted: isPresent
            };
        });

        const totalSessions = sessions.length;
        const attendancePercentage = totalSessions > 0
            ? (attendedCount / totalSessions) * 100
            : 0;

        return {
            total_assigned_sessions: totalSessions,
            total_attended: attendedCount,
            attendance_percentage: parseFloat(attendancePercentage.toFixed(2)),
            is_passed_attendance: attendedCount >= this.MIN_COACHING_ATTENDANCE,
            details: details
        };
    }
}
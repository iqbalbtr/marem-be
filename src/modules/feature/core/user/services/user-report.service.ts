import { PrismaService } from "@database/prisma.service";
import { NotFoundException, Injectable } from "@nestjs/common";
import { coaching_presence, coaching_session, Prisma } from "@prisma";

@Injectable()
export class UserReportService {
    private readonly MIN_COACHING_ATTENDANCE = 3;
    private readonly MIN_PASSING_SCORE = 60;

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getUserReport(userId: string, asesor_id?: string) {

        const userWhere: Prisma.usersWhereInput = { id: userId, role: 'participant' };

        if (asesor_id) {
            userWhere.participant_profile = { asesor_id };
        }

        const user = await this.prismaService.users.findFirst({
            where: userWhere,
            select: { id: true, name: true, participant_profile: true }
        });

        if (!user || !user.participant_profile) {
            throw new NotFoundException('User or profile not found');
        }

        const profile = user.participant_profile;

        const [coachingSessions, courses] = await Promise.all([
            this.prismaService.coaching_session.findMany({
                where: {
                    audience_type: 'participant',
                    stage: profile.stage,
                    OR: [
                        { coaching_type: 'classification', classification: profile.clasification },
                        { coaching_type: 'regional', regional: profile.province }
                    ],
                },
                include: {
                    coaching_presence: { where: { participant_id: userId } }
                }
            }),
            this.prismaService.courses.findMany({
                where: {
                    stage: profile.stage,
                    OR: [
                        { course_type: 'elective', classification: profile.clasification },
                        { course_type: 'mandatory', regional: profile.province }
                    ],
                },
                select: { id: true, title: true }
            })
        ]);

        const coachingReport = this.calculateCoachingStats(coachingSessions);

        let sumOfAverages = 0;
        let activeCourses: {
            course_id: string;
            title: string;
            average_score: number;
            quiz: {
                pre_test_score: number;
                post_test_score: number;
                increase_percentage: number;
            }
        }[] = [];

        if (courses.length > 0) {
            const submissions = await this.prismaService.course_item_submissions.findMany({
                where: {
                    user_id: userId,
                    status: 'graded',
                    course_id: { in: courses.map(c => c.id) }
                },
                select: {
                    course_id: true,
                    score: true,
                    item: { select: { category: true, data: true } }
                }
            });

            const courseStats = new Map();
            courses.forEach(c => {
                courseStats.set(c.id, {
                    title: c.title,
                    total_score: 0,
                    count: 0,
                    pre_test: 0,
                    post_test: 0
                });
            });

            submissions.forEach(sub => {
                const stat = courseStats.get(sub.course_id);
                if (!stat) return;

                stat.total_score += (sub.score || 0);
                stat.count += 1;

                if (sub.item?.category === 'quiz' && sub.item?.data) {
                    const data = sub.item.data as any;
                    if (data.submission_type === 'pre_test') {
                        stat.pre_test = sub.score || 0;
                    } else if (data.submission_type === 'post_test') {
                        stat.post_test = sub.score || 0;
                    }
                }
            });

            activeCourses = Array.from(courseStats.entries())
                .filter(([_, stat]) => stat.count > 0)
                .map(([course_id, stat]) => {
                    const avgScore = stat.total_score / stat.count;
                    sumOfAverages += avgScore;

                    const increaseQuizPercentage = stat.pre_test > 0 ? ((stat.post_test - stat.pre_test) / stat.pre_test) * 100 : 0;

                    return {
                        course_id,
                        title: stat.title,
                        average_score: parseFloat(avgScore.toFixed(2)),
                        quiz: {
                            pre_test_score: parseFloat(stat.pre_test.toFixed(2)),
                            post_test_score: parseFloat(stat.post_test.toFixed(2)),
                            increase_percentage: parseFloat(increaseQuizPercentage.toFixed(2))
                        }
                    };
                });
        }

        const avgGradeDataLength = activeCourses.length;
        const finalScore = avgGradeDataLength > 0 ? (sumOfAverages / avgGradeDataLength) : 0;

        return {
            user: { name: user.name, id: user.id },
            report: {
                coaching: coachingReport,
                course: {
                    average_score: parseFloat(finalScore.toFixed(2)),
                    is_passed_score: finalScore >= this.MIN_PASSING_SCORE,
                    total_courses_completed: avgGradeDataLength,
                    total_courses_assigned: courses.length,
                    details: activeCourses
                }
            }
        };
    }

    private calculateCoachingStats(sessions: (coaching_session & { coaching_presence: coaching_presence[] })[]) {
        let attendedCount = 0;
        const classification: any[] = [];
        const regional: any[] = [];

        for (const session of sessions) {
            const userPresence = session.coaching_presence?.[0];
            const isPresent = userPresence?.status === 'present';
            const statusLabel = isPresent ? 'HADIR' : (userPresence ? 'TIDAK HADIR' : 'BELUM DIISI');

            if (isPresent) attendedCount++;

            const detail = {
                session_title: session.title,
                status: statusLabel,
                date: session.start_time,
                category: session.coaching_type === 'classification' ? 'classification' : 'regional',
                is_counted: isPresent
            };

            if (detail.category === 'classification') {
                classification.push(detail);
            } else {
                regional.push(detail);
            }
        }

        classification.sort((a, b) => a.date.getTime() - b.date.getTime());
        regional.sort((a, b) => a.date.getTime() - b.date.getTime());

        const totalSessions = sessions.length;
        const attendancePercentage = totalSessions > 0 ? (attendedCount / totalSessions) * 100 : 0;

        return {
            total_assigned_sessions: totalSessions,
            total_attended: attendedCount,
            attendance_percentage: parseFloat(attendancePercentage.toFixed(2)),
            is_passed_attendance: attendedCount >= this.MIN_COACHING_ATTENDANCE,
            detail: {
                classification,
                regional
            }
        };
    }
}
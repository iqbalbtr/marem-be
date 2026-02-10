import { PrismaService } from "@database/prisma.service";
import { Injectable } from "@nestjs/common";
import { Utils } from "@utils/index";
import { module_category } from "@prisma";
import { LearningCourseAccessService } from "./learning-course-access.service";

@Injectable()
export class LearningStatisticService {

    private readonly BUSINESS_PROFILE_UPDATE_DAYS = 30;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly courseAccessService: LearningCourseAccessService,
    ) { }

    async getStatsForUser(userId: string) {
        const userInfo = await this.courseAccessService.getUserInfo(userId);
        
        const accessQuery = this.courseAccessService.getQueryCourseAccess(userInfo.participant_profile);
        const allCourses = await this.prismaService.courses.findMany({
            where: accessQuery,
            select: { id: true }
        });
        const courseIds = allCourses.map(c => c.id);

        if (courseIds.length === 0) {
            return this.getEmptyStats();
        }

        const [learningStats, coachingStats, businessStats] = await Promise.all([
            this.getLearningProgressStats(userId, courseIds),
            this.getCoachingStats(userId, userInfo.participant_profile),
            this.getBusinessStats(userInfo.participant_profile?.id)
        ]);

        const progressArticle = Utils.getPercentage(learningStats.completedArticles, learningStats.totalArticles);
        const progressTask = Utils.getPercentage(learningStats.completedTasks, learningStats.totalTasks);
        const progressCoaching = Utils.getPercentage(coachingStats.attendedSessions, coachingStats.totalSessions);

        return {
            business_development: {
                last_update: businessStats?.updated_at || null,
                is_updated_indicator: this.isBusinessProfileFresh(businessStats?.updated_at)
            },
            summary: {
                learning: {
                    percentage: progressArticle,
                    remaining: learningStats.totalArticles - learningStats.completedArticles,
                    total: learningStats.totalArticles,
                    completed: learningStats.completedArticles
                },
                tasks: {
                    percentage: progressTask,
                    remaining: learningStats.totalTasks - learningStats.completedTasks,
                    total: learningStats.totalTasks,
                    completed: learningStats.completedTasks
                },
                coaching: {
                    percentage: progressCoaching,
                    remaining: coachingStats.totalSessions - coachingStats.attendedSessions,
                    total: coachingStats.totalSessions,
                    completed: coachingStats.attendedSessions
                }
            },
            next_coaching: coachingStats.nextSession || null
        };
    }


    private async getLearningProgressStats(userId: string, courseIds: string[]) {
        const [totalArticles, completedArticles, totalTasks, completedTasks] = await Promise.all([
            this.prismaService.course_module_items.count({
                where: {
                    module: { course_id: { in: courseIds } },
                    category: module_category.article
                }
            }),
            this.prismaService.course_module_item_completions.count({
                where: {
                    user_id: userId,
                    item: {
                        module: { course_id: { in: courseIds } },
                        category: module_category.article
                    },
                }
            }),
            this.prismaService.course_module_items.count({
                where: {
                    module: { course_id: { in: courseIds } },
                    category: { in: [module_category.assignment, module_category.quiz] }
                }
            }),
            this.prismaService.course_item_submissions.count({
                where: {
                    user_id: userId,
                    item: {
                        module: { course_id: { in: courseIds } },
                        category: { in: [module_category.assignment, module_category.quiz] }
                    },
                }
            })
        ]);

        return { totalArticles, completedArticles, totalTasks, completedTasks };
    }

    private async getCoachingStats(userId: string, profile: any) {
        const accessQuery = this.courseAccessService.getCoachingAccessQuery(profile);
        
        if(!accessQuery.OR || accessQuery.OR.length === 0) {
            return { totalSessions: 0, attendedSessions: 0, nextSession: null };
        }

        const [totalSessions, attendedSessions, nextSession] = await Promise.all([
            this.prismaService.coaching_session.count({
                where: { OR: accessQuery.OR }
            }),
            this.prismaService.coaching_presence.count({
                where: {
                    participant_id: userId,
                    session: { OR: accessQuery.OR },
                    status: { in: ['present', 'late'] } 
                }
            }),

            this.prismaService.coaching_session.findFirst({
                where: {
                    status: 'scheduled',
                    OR: accessQuery.OR,
                    actual_start_time: { gte: new Date() } 
                },
                orderBy: { actual_start_time: 'asc' },
                include: {
                    mentor: {
                        select: { id: true, name: true, profile: true, email: true }
                    }
                }
            })
        ]);

        return { totalSessions, attendedSessions, nextSession };
    }

    private async getBusinessStats(profileId?: string) {
        if (!profileId) return null;
        return this.prismaService.business_developments.findFirst({
            where: {
                business: { participant_profile_id: profileId }
            },
            orderBy: { updated_at: 'desc' },
            select: { updated_at: true }
        });
    }

    private isBusinessProfileFresh(lastUpdate: Date | null | undefined): boolean {
        if (!lastUpdate) return false;
        const diffTime = Math.abs(new Date().getTime() - lastUpdate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= this.BUSINESS_PROFILE_UPDATE_DAYS;
    }

    private getEmptyStats() {
        return {
            business_development: { last_update: null, is_updated_indicator: false },
            summary: {
                learning: { percentage: 0, remaining: 0, total: 0, completed: 0 },
                tasks: { percentage: 0, remaining: 0, total: 0, completed: 0 },
                coaching: { percentage: 0, remaining: 0, total: 0, completed: 0 }
            },
            next_coaching: null
        }
    }
}
import { PrismaService } from "@database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserToken } from "@models/token.model";
import { GradingOrchestrator } from "../grading/grading.orchestrator";
import { LearningCourseAccessService } from "./learning-course-access.service";
import { GradingDto } from "../dto/grading.dto";
import { ModuleCategory, QuizData } from "../../core/course/course.constant";
import { PaginationHelper } from "src/helpers/pagination.helper";
import { PaginationDto } from "src/common/dto/pagination-dto";
import { QueryGradeDto } from "../../teaching/dto/query-grade.dto";


@Injectable()
export class LearningGradingService {

    constructor(
        private readonly gradingOrchestrator: GradingOrchestrator,
        private readonly courseAccessService: LearningCourseAccessService,
        private readonly prismaService: PrismaService,
    ) { }

    async getAllSubmissions(user: UserToken, query: QueryGradeDto) {
        let qBuilder = PaginationHelper.getWhereQuery('course_item_submissions', {
            user_id: user.user_id,
        })

        if (query.status) {
            qBuilder.status
        }

        return PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'course_item_submissions',
            whereQuery: qBuilder,
            orderByQuery: {
                submitted_at: 'desc'
            },
            selectQuery: {
                id: true,
                score: true,
                status: true,
                graded_at: true,
                graded_by: true,
                item: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                    }
                }
            }
        })
    }

    async getAllSubmissionsCourses(user: UserToken, query: PaginationDto) {
        const userInfo = await this.courseAccessService.getUserInfo(user.user_id);
        const qBuilder = PaginationHelper.getWhereQuery('course_module_items', {
            module: {
                course: this.courseAccessService.getQueryCourseAccess(userInfo.participant_profile!)
            },
            category: {
                in: [ModuleCategory.ASSIGNMENT, ModuleCategory.QUIZ]
            }
        })

        if (query.search) {
            qBuilder.AND = [
                {
                    OR: [
                        { title: { contains: query.search, mode: 'insensitive' } },
                    ]
                }
            ]
        }

        return PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'course_module_items',
            whereQuery: qBuilder,
            orderByQuery: {
                created_at: 'desc'
            },
            selectQuery: {
                id: true,
                title: true,
                category: true,
                created_at: true,
                submissions: {
                    where: { user_id: user.user_id },
                    select: {
                        id: true,
                        status: true,
                        score: true,
                        graded_at: true,
                    },
                },
            },
            transformData: (data) => data.map(({ submissions = [], ...item }) => ({
                ...item,
                submission: submissions[0]?.id || null ? {
                    id: submissions[0].id,
                    status: submissions[0]?.status || null,
                    score: submissions[0]?.score || null,
                    graded_at: submissions[0]?.graded_at || null,
                } : null
            }))
        })
    }

    async getStaticaticsForCourse(token: UserToken) {
        const [totalSubmissions, pendingSubmissions, submitedSubmissions] = await Promise.all([
            this.prismaService.course_item_submissions.count({
                where: {
                    user_id: token.user_id
                }
            }),
            this.prismaService.course_item_submissions.count({
                where: {
                    user_id: token.user_id,
                    status: 'submitted'
                }
            }),
            this.prismaService.course_item_submissions.count({
                where: {
                    user_id: token.user_id,
                    status: 'graded'
                }
            })
        ])

        const averageScoreAgg = await this.prismaService.course_item_submissions.aggregate({
            where: {
                user_id: token.user_id,
                status: 'graded'
            },
            _avg: {
                score: true
            }
        });

        return {
            submission_total: {
                total: totalSubmissions,
                pending: pendingSubmissions,
                graded: submitedSubmissions
            },
            average_score: averageScoreAgg._avg.score || 0
        }
    }

    async submitByStudent(
        itemId: string,
        user: UserToken,
        dto: GradingDto
    ) {

        const userInfo = await this.courseAccessService.getUserInfo(user.user_id);
        const item = await this.courseAccessService.findParticipantItemWithAccess(itemId, userInfo.participant_profile);
        if (!item) {
            throw new NotFoundException(`Module item with ID ${itemId} not found.`);
        }
        if (item.category !== dto.data.category) {
            throw new NotFoundException(`Module item with ID ${itemId} is not of category ${dto.data.category}.`);
        }
        return this.gradingOrchestrator.grade(user, dto.data.category, item, dto.data);
    }

    async getSubmissionDetails(submissionId: string) {
        const submission = await this.prismaService.course_item_submissions.findUnique({
            where: { id: submissionId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                        participant_profile: true
                    }
                },
                item: true
            }
        });
        if (!submission) {
            throw new NotFoundException(`Submission with ID ${submissionId} not found.`);
        }

        const questionMapped = submission.item.category === ModuleCategory.QUIZ ? (submission.item.data as unknown as QuizData).questions.map(q => ({
            ...q,
            options: q.options.map(({ is_correct, ...o }) => ({
                ...o,
            }))
        })) : null;

        return {
            ...submission,
            item: {
                ...submission.item,
                data: submission.item.category === ModuleCategory.QUIZ ? {
                    ...submission.item.data as unknown as QuizData,
                    questions: questionMapped
                } : submission.item.data
            }
        };
    }
}
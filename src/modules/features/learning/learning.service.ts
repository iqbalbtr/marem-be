import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QueryLearningDto } from './dto/query-learning.dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { Prisma, course_type, module_category } from '@prisma';
import { LearningAccessService } from './services/learning-access.service';
import { LearningProgressService } from './services/learning-progress.service';
import { ModuleCategory, QuizData } from '../course/course.constant';

@Injectable()
export class LearningService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly learningAccessService: LearningAccessService,
        private readonly learningProgressService: LearningProgressService,
    ) { }

    async getLearnings(user: UserToken, query: QueryLearningDto) {
        const userInfo = await this.learningAccessService.getUserInfo(user.user_id);
        const qBuilder = PaginationHelper.getWhereQuery('courses');

        const accessFilter: Prisma.coursesWhereInput[] = [];

        if (query.is_classification && userInfo.participant_profile?.clasification) {
            accessFilter.push({
                course_type: course_type.elective,
                classification: userInfo.participant_profile.clasification
            });
        }

        if (query.is_regional && userInfo.participant_profile?.province) {
            accessFilter.push({
                course_type: course_type.mandatory,
                regional: userInfo.participant_profile.province
            });
        }

        if (accessFilter.length > 0) {
            qBuilder.OR = accessFilter;
        }

        if (query.search) {
            const searchAccess = this.learningAccessService.getQueryLearningAccess(userInfo.participant_profile!);
            qBuilder.AND = [
                {
                    OR: [
                        { title: { contains: query.search, mode: 'insensitive' } },
                    ]
                },
                searchAccess
            ];
        } else {
            qBuilder.AND = [this.learningAccessService.getQueryLearningAccess(userInfo.participant_profile!)];
        }

        const learnings = await PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'courses',
            whereQuery: qBuilder,
            selectQuery: {
                id: true,
                title: true,
                description: true,
                course_type: true,
                classification: true,
                regional: true,
                created_at: true,
                updated_at: true,
                is_published: true,
                courses_participants: {
                    where: { user_id: user.user_id },
                    select: { enrolled_at: true, finished_at: true },
                    take: 1
                },
                mentor: {
                    select: { id: true, name: true, email: true, profile: true }
                }
            }
        });

        return {
            ...learnings,
            data: learnings.data.map(({ courses_participants, ...learning }) => ({
                ...learning,
                is_finished: !!courses_participants?.[0]?.finished_at,
            }))
        };
    }

    async getLearningModule(user: UserToken, learningId: string) {
        const userInfo = await this.learningAccessService.getUserInfo(user.user_id);

        const modules = await this.prismaService.course_modules.findMany({
            where: {
                course_id: learningId,
                course: this.learningAccessService.getQueryLearningAccess(userInfo.participant_profile!)
            },
            include: {
                course_module_completions: {
                    where: { user_id: user.user_id },
                    take: 1
                }
            },
            orderBy: { sequence: 'asc' }
        });

        return modules.map(({ course_module_completions, ...module }) => ({
            ...module,
            is_completed: course_module_completions.length > 0
        }));
    }

    async getLearningModuleItems(user: UserToken, learningId: string, moduleId: string) {
        const userInfo = await this.learningAccessService.getUserInfo(user.user_id);

        const items = await this.prismaService.course_module_items.findMany({
            where: {
                module_id: moduleId,
                module: {
                    course: this.learningAccessService.getQueryLearningAccess(userInfo.participant_profile!)
                }
            },
            select: {
                id: true,
                title: true,
                category: true,
                created_at: true,
                sequence: true,
                is_published: true,
                course_module_item_completions: {
                    where: { user_id: user.user_id },
                    take: 1
                }
            },
            orderBy: { sequence: 'asc' }
        });

        return items.map(({ course_module_item_completions, ...item }) => ({
            ...item,
            is_completed: course_module_item_completions.length > 0
        }));
    }

    async getMaterialContent(user: UserToken, itemId: string) {
        const userInfo = await this.learningAccessService.getUserInfo(user.user_id);

        const item = await this.learningAccessService.findParticipantItemWithAccess(itemId, userInfo.participant_profile!);

        await this.learningProgressService.validateSequenceAccess(user.user_id, item);

        const { course_module_item_completions, ...data } = item;

        const questionMapped = data.category === ModuleCategory.QUIZ ? (data.data as unknown as QuizData).questions.map(q => ({
            ...q,
            options: q.options.map(({ is_correct, ...o }) => ({
                ...o,
            }))
        })) : null;

        return {
            ...data,
            data: {
                ...data.data as object,
                ...(questionMapped ? { questions: questionMapped } : {})
            },
            is_completed: course_module_item_completions.length > 0
        };
    }

    async markMaterialAsCompleted(userId: string, learningId: string, itemId: string) {
        const userInfo = await this.learningAccessService.getUserInfo(userId);

        const item = await this.learningAccessService.findParticipantItemWithAccess(itemId, userInfo.participant_profile!);

        if (item.course_module_item_completions.length > 0) {
            throw new BadRequestException('Material already completed');
        }

        if (item.category !== module_category.article) {
            throw new BadRequestException('Only article material can be marked manually');
        }

        await this.learningProgressService.validateSequenceAccess(userId, item);

        return this.prismaService.$transaction(async (tx) => {

            const completion = await tx.course_module_item_completions.create({
                data: {
                    user_id: userId,
                    item_id: item.id
                }
            });
            await this.learningProgressService.checkAndCompleteModule(tx, userId, item.module_id);
            await this.learningProgressService.checkAndCompleteCourse(tx, userId, learningId);
            return completion;
        });
    }
}
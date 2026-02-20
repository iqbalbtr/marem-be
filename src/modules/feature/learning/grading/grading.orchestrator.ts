import { Injectable } from "@nestjs/common";
import { AssignmentGradingStrategy } from "./strategies/assignment-grading.strategy";
import { QuizGradingStrategy } from "./strategies/quiz-grading.strategy";
import { course_module_items, course_modules, module_category, Prisma, PrismaClient } from "@prisma";
import { UserToken } from "@models/token.model";
import { GradingResult, IGradingStrategy } from "./grading.interface";
import { AssignmentGradingDto, QuizGradingDto } from "../dto/grading.dto";
import { LearningCourseProgressService } from "../services/learning-course-progress.service";

@Injectable()
export class GradingOrchestrator {

    constructor(
        private readonly assignmentGradingStrategy: AssignmentGradingStrategy,
        private readonly quizGradingStrategy: QuizGradingStrategy,
        private readonly learningCourseProgressService: LearningCourseProgressService
    ) { }

    async grade(
        user: UserToken,
        category: module_category,
        item: course_module_items & { module: course_modules },
        dto: AssignmentGradingDto | QuizGradingDto,
    ) {
        let strategy: IGradingStrategy;

        switch (category) {
            case module_category.assignment:
                strategy = this.assignmentGradingStrategy;
                break;
            case module_category.quiz:
                strategy = this.quizGradingStrategy;
                break;
            default:
                throw new Error(`No grading strategy found for category: ${category}`);
        }

        return strategy.execute(user, item, dto, async (_, tx) => {
            await tx.course_module_item_completions.upsert({
                where: {
                    user_id_item_id: {
                        user_id: user.user_id,
                        item_id: item.id
                    }
                },
                create: {
                    user_id: user.user_id,
                    item_id: item.id,
                    marked_at: new Date()
                },
                update: {
                    marked_at: new Date()
                }
            });
            await this.learningCourseProgressService.checkAndCompleteModule(tx, user.user_id, item.module_id);
            await this.learningCourseProgressService.checkAndCompleteCourse(tx, user.user_id, item.module.course_id);
        });
    }
}
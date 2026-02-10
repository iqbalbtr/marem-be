import { Injectable } from "@nestjs/common";
import { AssignmentGradingStrategy } from "./strategies/assignment-grading.strategy";
import { QuizGradingStrategy } from "./strategies/quiz-grading.strategy";
import { course_module_items, module_category } from "@prisma";
import { UserToken } from "@models/token.model";
import { IGradingStrategy } from "./grading.interface";
import { AssignmentGradingDto, QuizGradingDto } from "../dto/grading.dto";

@Injectable()
export class GradingOrchestrator {

    constructor(
        private readonly assignmentGradingStrategy: AssignmentGradingStrategy,
        private readonly quizGradingStrategy: QuizGradingStrategy
    ) { }

    async grade(
        user: UserToken,
        category: module_category,
        item: course_module_items,
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

        return strategy.execute(user, item, dto);
    }
}
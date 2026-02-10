import { PrismaService } from "@database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserToken } from "@models/token.model";
import { GradingOrchestrator } from "../grading/grading.orchestrator";
import { LearningCourseAccessService } from "./learning-course-access.service";
import { GradingDto } from "../dto/grading.dto";
import { ModuleCategory, QuizData } from "../../core/course/course.constant";


@Injectable()
export class LearningGradingService {

    constructor(
        private readonly gradingOrchestrator: GradingOrchestrator,
        private readonly courseAccessService: LearningCourseAccessService,
        private readonly prismaService: PrismaService,
    ) { }

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
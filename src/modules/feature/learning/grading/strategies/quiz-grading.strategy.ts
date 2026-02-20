import { PrismaService } from "@database/prisma.service";
import { GradingResult, IGradingStrategy } from "../grading.interface";
import { UserToken } from "@models/token.model";
import { course_module_items, course_modules, Prisma } from "@prisma";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { QuizGradingDto, QuizItemDto } from "../../dto/grading.dto";
import { QuizData, QuizQuestion } from "src/modules/feature/core/course/course.constant";
import { QuizDataDto } from "src/modules/feature/core/course/dto/create-module.dto";
import { TransactionClient } from "prisma/generated/prisma/internal/prismaNamespace";

@Injectable()
export class QuizGradingStrategy implements IGradingStrategy {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async execute(
        user: UserToken,
        item: course_module_items & { module: course_modules },
        submissionData: QuizGradingDto,
        cb: (result: GradingResult, tx?: TransactionClient) => Promise<void>
    ): Promise<GradingResult> {

        const itemData = item.data as unknown as QuizDataDto
        const countSubmission = await this.prismaService.course_item_submissions.count({
            where: {
                user_id: user.user_id,
                item_id: item.id
            }
        });

        if (itemData.max_attempts && countSubmission >= itemData.max_attempts) {
            throw new ForbiddenException(`Maximum submission attempts reached for assignment with ID ${item.id}.`);
        }

        const gradingResult = this.processAnswers(submissionData, item.data as unknown as QuizData);

        const result = await this.prismaService.$transaction(async (tx) => {
            const graded = await tx.course_item_submissions.upsert({
                where: {
                    user_id_item_id: {
                        user_id: user.user_id,
                        item_id: item.id
                    }
                },
                create: {
                    user_id: user.user_id,
                    item_id: item.id,
                    response_snapshot: {
                        category: submissionData.category,
                        answers: gradingResult.newAnswers
                    } as unknown as Prisma.JsonObject,
                    status: 'graded',
                    submitted_at: new Date(),
                    graded_at: new Date(),
                    score: gradingResult.totalScore,
                    course_id: item.module.course_id
                },
                update: {
                    response_snapshot: {
                        category: submissionData.category,
                        answers: gradingResult.newAnswers
                    } as unknown as Prisma.JsonObject,
                    status: 'graded',
                    graded_at: new Date(),
                    score: gradingResult.totalScore
                }
            })

            if (gradingResult.passed) {
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
                })
            }

            const result: GradingResult = {
                score: gradingResult.totalScore,
                status: 'graded',
                metadata: {
                    submission_id: graded.id,
                    total_score: gradingResult.totalAllScore,
                    passed: gradingResult.passed
                }
            }

            await cb(result, tx);
            return result;
        });

        return result;
    }

    private processAnswers(
        submissionData: QuizGradingDto,
        masterData: QuizData
    ) {
        let totalScore = 0;
        let totalAllScore = masterData.questions.reduce((acc, curr) => acc + curr.points, 0);
        const passingScore = masterData.passing_score

        let newAnswers: QuizItemDto[] = [];

        const questionMap = new Map<string, QuizQuestion>();

        for (const question of masterData.questions) {
            questionMap.set(question.id, question);
        }

        for (const answer of submissionData.answers) {
            const question = questionMap.get(answer.question_id);
            if (question) {
                if (masterData.time_limit_seconds && answer.total_time_seconds > masterData.time_limit_seconds) {
                    newAnswers.push(answer);
                    continue;
                }
                const selectedOption = question.options.find((opt) => opt.id === answer.answer_id);
                if (selectedOption && selectedOption.is_correct) {
                    totalScore += question.points;
                }
                newAnswers.push(answer);
            }
        }

        return {
            totalScore,
            totalAllScore,
            newAnswers,
            passed: totalScore >= passingScore
        }
    }
}
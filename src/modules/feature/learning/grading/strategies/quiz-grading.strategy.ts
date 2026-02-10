import { PrismaService } from "@database/prisma.service";
import { GradingResult, IGradingStrategy } from "../grading.interface";
import { UserToken } from "@models/token.model";
import { course_module_items, Prisma } from "@prisma";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { QuizGradingDto, QuizItemDto } from "../../dto/grading.dto";
import { QuizData, QuizQuestion } from "src/modules/feature/core/course/course.constant";

@Injectable()
export class QuizGradingStrategy implements IGradingStrategy {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async execute(
        user: UserToken,
        item: course_module_items,
        submissionData: QuizGradingDto,
    ): Promise<GradingResult> {

        const isGraded = await this.prismaService.course_item_submissions.findUnique({
            where: {
                user_id_item_id: {
                    user_id: user.user_id,
                    item_id: item.id
                }
            }
        });

        if(isGraded){
            throw new ForbiddenException(`Submission for item ID ${item.id} by user ID ${user.user_id} has already been graded.`);
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
                    status: 'submitted',
                    submitted_at: new Date(),
                    graded_at: new Date(),
                    score: gradingResult.totalScore
                },
                update: {
                    response_snapshot: {
                        category: submissionData.category,
                        answers: gradingResult.newAnswers
                    } as unknown as Prisma.JsonObject,
                    status: 'submitted',
                    graded_at: new Date(),
                    score: gradingResult.totalScore
                }
            })

            if(gradingResult.passed){
                await tx.course_module_item_completions.upsert({
                    where:{
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

            return graded
        });

        return {
            score: gradingResult.totalScore,
            status: 'submitted',
            metadata: {
                submission_id: result.id
            }
        }
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
                if(masterData.time_limit_seconds && answer.total_time_seconds > masterData.time_limit_seconds){
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
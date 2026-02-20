import { PrismaService } from "@database/prisma.service";
import { GradingResult, IGradingStrategy } from "../grading.interface";
import { UserToken } from "@models/token.model";
import { course_module_items, course_modules, PrismaClient } from "@prisma";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { AssignmentGradingDto } from "../../dto/grading.dto";
import { AssignmentDataDto } from "src/modules/feature/core/course/dto/create-module.dto";
import { TransactionClient } from "prisma/generated/prisma/internal/prismaNamespace";

@Injectable()
export class AssignmentGradingStrategy implements IGradingStrategy {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async execute(
        user: UserToken,
        item: course_module_items & { module: course_modules },
        submissionData: AssignmentGradingDto,
        cb: (result: GradingResult, tx?: TransactionClient) => Promise<void>
    ): Promise<GradingResult> {

        const itemData = item.data as unknown as AssignmentDataDto

        if (new Date(itemData.due_date) < new Date()) {
            throw new ForbiddenException(`The assignment with ID ${item.id} is past its due date.`);
        }

        const countSubmission = await this.prismaService.course_item_submissions.count({
            where: {
                user_id: user.user_id,
                item_id: item.id
            }
        });

        if (itemData.max_attempts && countSubmission >= itemData.max_attempts) {
            throw new ForbiddenException(`Maximum submission attempts reached for assignment with ID ${item.id}.`);
        }

        const result = await this.prismaService.$transaction(async (tx) => {
            const grade = await tx.course_item_submissions.upsert({
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
                        file_url: submissionData.file_url,
                        answer_text: submissionData.answer_text
                    },
                    status: 'submitted',
                    submitted_at: new Date(),
                    score: null,
                    course_id: item.module.course_id
                },
                update: {
                    response_snapshot: {
                        category: submissionData.category,
                        file_url: submissionData.file_url,
                        answer_text: submissionData.answer_text
                    },
                    status: 'submitted',
                    submitted_at: new Date()
                }
            });

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

            
            const gradingResult: GradingResult = {
                score: null,
                status: 'submitted',
                metadata: {
                    submission_id: grade.id
                }
            }

            await cb(gradingResult, tx);
            return gradingResult;
        });

        return result;
    }
}
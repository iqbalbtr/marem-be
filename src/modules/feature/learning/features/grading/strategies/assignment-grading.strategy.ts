import { PrismaService } from "@database/prisma.service";
import { GradingResult, IGradingStrategy } from "../grading.interface";
import { UserToken } from "@models/token.model";
import { course_module_items } from "@prisma";
import { Injectable } from "@nestjs/common";
import { AssignmentGradingDto } from "../dto/grading.dto";
import { AssignmentDataDto } from "src/modules/feature/course/dto/create-module.dto";

@Injectable()
export class AssignmentGradingStrategy implements IGradingStrategy {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async execute(
        user: UserToken,
        item: course_module_items,
        submissionData: AssignmentGradingDto,
    ): Promise<GradingResult> {

        const itemData = item.data as unknown as AssignmentDataDto

        if(new Date(itemData.due_date) < new Date()){
            throw new Error(`The assignment with ID ${item.id} is past its due date.`);
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
                    score: null
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

            return grade;
        });

        return {
            score: null,
            status: 'submitted',
            metadata: {
                submission_id: result.id
            }
        }
    }
}
import { PrismaService } from "@database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GradingOrchestrator } from "./grading.orchestrator";
import { UserToken } from "@models/token.model";
import { module_category, user_role } from "@prisma";
import { GradeMentorDto, GradingDto } from "../dto/grading.dto";
import { LearningAccessService } from "../services/learning-access.service";
import { PaginationDto } from "src/common/dto/pagination-dto";
import { PaginationHelper } from "src/helpers/pagination.helper";

@Injectable()
export class GradingService {

    constructor(
        private readonly gradingOrchestrator: GradingOrchestrator,
        private readonly learningAccessService: LearningAccessService,
        private readonly prismaService: PrismaService,
    ) { }

    async submitByStudent(
        itemId: string,
        user: UserToken,
        dto: GradingDto
    ) {

        const userInfo = await this.learningAccessService.getUserInfo(user.user_id);
        const item = await this.learningAccessService.findParticipantItemWithAccess(itemId, userInfo.participant_profile);
        if (!item) {
            throw new Error(`Module item with ID ${itemId} not found.`);
        }
        return this.gradingOrchestrator.grade(user, dto.data.category, item, dto.data);
    }

    async gradeByMentor(
        submissionId: string,
        user: UserToken,
        dto: GradeMentorDto
    ) {

        const submisison = await this.prismaService.course_item_submissions.findUnique({
            where: { id: submissionId }
        });

        if (!submisison) {
            throw new NotFoundException(`Submission with ID ${submissionId} not found.`);
        }

        const asesorInfo = await this.learningAccessService.getUserInfo(user.user_id, user_role.asesor);
        await this.learningAccessService.findAssessorItemWithAccess(submisison.item_id, asesorInfo.assesor_profile);

        const participantUser = await this.prismaService.users.findUnique({
            where: { id: dto.participant_id }
        });

        if (!participantUser) {
            throw new NotFoundException(`Participant with ID ${dto.participant_id} not found.`);
        }

        return this.prismaService.course_item_submissions.update({
            where: { id: submissionId },
            data: {
                score: dto.score,
                feedback: dto.feedback,
                graded_at: new Date(),
                graded_by: {
                    id: user.user_id,
                    name: user.name,
                    email: user.email,
                    profile: asesorInfo.assesor_profile
                }
            }
        });
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
                }
            }
        });
        if (!submission) {
            throw new NotFoundException(`Submission with ID ${submissionId} not found.`);
        }
        return submission;
    }

    async getSubmissionsByItem(user: UserToken, itemId: string, query: PaginationDto) {
        const asesorInfo = await this.learningAccessService.getUserInfo(user.user_id, user_role.asesor);
        await this.learningAccessService.findAssessorItemWithAccess(itemId, asesorInfo.assesor_profile);

        const qBuilder = PaginationHelper.getWhereQuery('course_item_submissions', {
            item_id: itemId
        })

        return PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'course_item_submissions',
            whereQuery: qBuilder,
            orderByQuery: {
                updated_at: 'desc'
            },
            includeQuery: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                        participant_profile: true
                    }
                },
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
}
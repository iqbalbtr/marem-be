import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GradeMentorDto } from './dto/grade-mentor.dto';
import { TeachingAccessService } from '../services/teaching-access.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';

@Injectable()
export class GradingService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly teachingAccessService: TeachingAccessService
    ) { }

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

        const asesorInfo = await this.teachingAccessService.getUserInfo(user.user_id);
        await this.teachingAccessService.findAssessorItemWithAccess(submisison.item_id, asesorInfo.assesor_profile);

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

    async getSubmissionsByItem(user: UserToken, itemId: string, query: PaginationDto) {
        const asesorInfo = await this.teachingAccessService.getUserInfo(user.user_id);
        await this.teachingAccessService.findAssessorItemWithAccess(itemId, asesorInfo.assesor_profile);

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
            selectQuery: {
                id: true,
                submitted_at: true,
                graded_at: true,
                graded_by: true,
                score: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true
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
        return submission;
    }
}

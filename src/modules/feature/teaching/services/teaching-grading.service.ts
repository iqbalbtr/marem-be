import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TeachingAccessService } from './teaching-access.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { GradeMentorDto } from '../dto/grade-mentor.dto';
import { QueryGradeDto } from '../dto/query-grade.dto';
import { Prisma } from '@prisma';

@Injectable()
export class TeachingGradingService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly teachingAccessService: TeachingAccessService
    ) { }

    async getSubmisisonStatistic(user: UserToken) {

        const baseQuery: Prisma.course_module_itemsWhereInput = {
            module: {
                course: {
                    asesor_id: user.user_id
                }
            }
        }

        const [totalSubmissions, pendingSubmissions, gradedSubmissions] = await Promise.all([
            this.prismaService.course_item_submissions.count({
                where: {
                    item: baseQuery
                }
            }),
            this.prismaService.course_item_submissions.count({
                where: {
                    item: baseQuery,
                    status: 'submitted'
                }
            }),
            this.prismaService.course_item_submissions.count({
                where: {
                    item: baseQuery,
                    status: 'graded'
                }
            })
        ])

        const averageScoreAgg = await this.prismaService.course_item_submissions.aggregate({
            where: {
                item: baseQuery,
                status: 'graded'
            },
            _avg: {
                score: true
            }
        });

        return {
            submission_total: {
                total: totalSubmissions,
                pending: pendingSubmissions,
                graded: gradedSubmissions
            },
            average_score: averageScoreAgg._avg.score || 0
        }

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

        const asesorInfo = await this.teachingAccessService.getUserInfo(user.user_id);
        await this.teachingAccessService.findAssessorItemWithAccess(submisison.item_id, asesorInfo.assesor_profile);

        return this.prismaService.course_item_submissions.update({
            where: { id: submissionId },
            data: {
                score: dto.score,
                feedback: dto.feedback,
                status: 'graded',
                graded_at: new Date(),
                graded_by: {
                    id: user.user_id,
                    name: user.name,
                    email: user.email,
                    profile: asesorInfo.profile
                }
            }
        });
    }

    async getSubmissionsByItem(user: UserToken, query: QueryGradeDto) {
        const asesorInfo = await this.teachingAccessService.getUserInfo(user.user_id);

        const qBuilder = PaginationHelper.getWhereQuery('course_item_submissions', {
            item: {
                module: {
                    course: {
                        id: query.course_id ? query.course_id : undefined,
                        asesor_id: asesorInfo.id
                    }
                }
            }
        })

        if (query.material_item_id) {
            qBuilder.item_id = query.material_item_id;
        }

        if (query.status) {
            qBuilder.status = query.status;
        }

        if (query.search) {
            qBuilder.AND = [
                {
                    OR: [
                        { user: { name: { contains: query.search, mode: 'insensitive' } } },
                        { user: { email: { contains: query.search, mode: 'insensitive' } } }
                    ]
                }
            ]
        }        

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

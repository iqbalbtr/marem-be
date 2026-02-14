import { PrismaService } from '@database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { Prisma, survey_status, user_role } from '@prisma';
import { QuerySurveyDto } from '../dto/query-survey.dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';

type ListSurveyOption = {
    reponseIndicator: boolean
    user_id: string
    statusAllowed?: survey_status[]
}

@Injectable()
export class SurveyService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getListSurveys(query: QuerySurveyDto, option?: ListSurveyOption) {
        const whereClause = PaginationHelper.getWhereQuery('surveys', {});
        if (query.target_role) {
            whereClause.target_role = query.target_role;
        }
        if (query.search) {
            whereClause.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.status) {
            whereClause.status = query.status;
        }
        if (option?.statusAllowed && option.statusAllowed.length > 0) {
            whereClause.status = { in: option.statusAllowed };
        }
        return await PaginationHelper.createPaginationData({
            table: 'surveys',
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            whereQuery: whereClause,
            orderByQuery: {
                created_at: 'desc'
            },
            includeQuery: option && {
                survey_responses: {
                    where: {
                        user_id: option.user_id
                    },
                    take: 1
                }
            },
            transformData: (data) => data.map(({ survey_responses, ...item }) => ({
                ...item,
                ...(option && {
                    has_responded: survey_responses ? survey_responses.length > 0 : false
                })
            }))
        });
    }

    async createSurvey(surveyData: CreateSurveyDto) {
        const survey = await this.prismaService.surveys.create({
            data: {
                title: surveyData.title,
                description: surveyData.description,
                target_role: surveyData.target_role,
                survey_items: {
                    createMany: {
                        data: surveyData.questions.map(item => ({
                            id: item.data.id,
                            category: item.data.category,
                            title: item.data.title,
                            required: item.data.required,
                            data: item.data as unknown as Prisma.InputJsonValue
                        }))
                    }
                }
            },
        });

        return survey;
    }

    async getSurveyById(surveyId: string, target_role?: user_role) {

        const qBuilder = PaginationHelper.getWhereQuery('surveys');

        if (target_role) {
            qBuilder.target_role = target_role;
        }

        const survey = await this.prismaService.surveys.findFirst({
            where: {
                id: surveyId,
                ...qBuilder
            },
            include: {
                survey_items: true
            }
        });

        if (!survey) {
            throw new NotFoundException(`Survey with ID ${surveyId} not found.`);
        }

        return survey;
    }

    async updateSurvey(surveyId: string, surveyData: CreateSurveyDto) {

        const survey = await this.prismaService.surveys.findFirst({
            where: {
                id: surveyId
            },
            include: {
                survey_items: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!survey) {
            throw new NotFoundException(`Survey with ID ${surveyId} not found.`);
        }

        return await this.prismaService.$transaction(async prisma => {
            await prisma.surveys.update({
                where: {
                    id: surveyId
                },
                data: {
                    title: surveyData.title,
                    description: surveyData.description,
                    target_role: surveyData.target_role,
                },
            })

            const currentIds = survey.survey_items.map(i => i.id);
            const deleteItemIds = currentIds.filter(id => !surveyData.questions.find(q => q.data.id === id));
            const updateItems = surveyData.questions.filter(q => currentIds.includes(q.data.id));

            if (deleteItemIds.length > 0) {
                await prisma.survey_items.deleteMany({
                    where: {
                        id: { in: deleteItemIds }
                    }
                });
            }

            const promises: Prisma.PrismaPromise<any>[] = [];
            for (const item of updateItems) {
                promises.push(prisma.survey_items.upsert({
                    where: {
                        id: item.data.id
                    },
                    update: {
                        category: item.data.category,
                        survey_id: surveyId,
                        data: item.data as unknown as Prisma.InputJsonValue
                    },
                    create: {
                        id: item.data.id,
                        category: item.data.category,
                        survey_id: surveyId,
                        data: item.data as unknown as Prisma.InputJsonValue
                    }
                }));
            }
            await Promise.all(promises);
        })
    }

    async deleteSurvey(surveyId: string) {
        const survey = await this.prismaService.surveys.findUnique({
            where: {
                id: surveyId
            }
        });
        if (!survey) {
            throw new NotFoundException(`Survey with ID ${surveyId} not found.`);
        }
        return this.prismaService.surveys.delete({
            where: {
                id: surveyId
            }
        });
    }
}

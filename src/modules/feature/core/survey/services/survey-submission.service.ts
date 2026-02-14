import { PrismaService } from "@database/prisma.service";
import { UserToken } from "@models/token.model";
import { BaseSubmitItemSurveyDto, CheckboxSubmitSurveyDto, OptionSubmitSurveyDto, SubmitSurveyDto } from "../dto/submit-survey.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma, survey_category, survey_items, survey_reponse_item } from "@prisma";
import { BaseItemSurveyDto, CheckboxSurveyDto, OptionSurveyDto } from "../dto/create-survey.dto";
import {v4 as uuid} from 'uuid'

type Statistic = {
    chart_type: 'line' | 'bar' | 'stacked_bar',
    labels: string;
    series: {
        label: string;
        value: number;
        percentage: number
    } | {
        name: string;
        data: number[]
    }
}

type StatisicItemSurvey = {
    title: string;
    category: survey_category;
    statistic: string[] | Statistic
}

export class SurveySubmissionService {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async submitSurvey(surveyId: string, user: UserToken, responses: SubmitSurveyDto) {
        const survey = await this.prismaService.surveys.findUnique({
            where: {
                id: surveyId,
                target_role: user.role
            },
            include: {
                survey_responses: {
                    where: {
                        user_id: user.user_id
                    },
                    take: 1
                },
                survey_items: true
            }
        });
        if (!survey) {
            throw new NotFoundException('Survey not found or already responded');
        }
        if (!survey.can_update_response && survey.survey_responses.length > 0) {
            throw new NotFoundException('Survey already responded');
        }
        if(['closed', 'archived', 'draft'].includes(survey.status)){
            throw new BadRequestException('Survey is not accepting responses');
        }

        for (const item of survey.survey_items){
            const response = responses.questions.find(rp => rp.question_id == item.id)
            this.validateResponses(item, response?.data)
        }
        
        return await this.prismaService.$transaction(async (prisma) => {
            const surveyResponseId = survey.survey_responses[0].id || uuid()
            const updated = await prisma.survey_responses.upsert({
                where: {
                    id: surveyResponseId
                },
                create:{
                    user_id: user.user_id,
                    survey_id: surveyId,
                },
                update: {
                    updated_at: new Date()
                }
            })
            
            await prisma.survey_reponse_item.deleteMany({
                where: {
                    survey_response_id: updated.id,
                    user_id: user.user_id
                }
            })

            await prisma.survey_reponse_item.createMany({
                data: responses.questions.map(rp => ({
                    survey_response_id: updated.id,
                    survey_item_id: rp.question_id,
                    user_id: user.user_id,
                    answer: rp.data as unknown as Prisma.InputJsonValue
                }))
            })

            return updated
        })
        
    }

    async getSubmissionById(surveyId: string, user: UserToken) {
        const survey = await this.prismaService.surveys.findUnique({
            where: {
                id: surveyId,
            },
            include: {
                survey_responses: {
                    where: {
                        user_id: user.user_id,
                    },
                    take: 1,
                },
                survey_items: {
                    include: {
                        survey_reponse_item: {
                            where: {
                                user_id: user.user_id,
                            },
                            take: 1,
                        }
                    }
                },
            },
        })

        if (!survey) {
            throw new NotFoundException(`Survey with ID ${surveyId} not found.`);
        }

        const { survey_responses, ...result } = survey

        return {
            ...result,
            survey_items: result.survey_items.map(({ survey_reponse_item, ...item }) => ({
                ...item,
                response: survey_reponse_item.length > 0 ? survey_reponse_item[0].answer : null
            })),
            is_responded: survey_responses.length > 0,
        };
    }
    
    private validateResponses(item: survey_items, response?: BaseSubmitItemSurveyDto) {

        if((item.data as unknown as BaseItemSurveyDto).required && !response){
            throw new BadRequestException('item ' + item.id + 'required')
        }

        if(!response)
            return

        switch (response.category) {
            case survey_category.checkboxes:
                for (const cb of (item.data as unknown as CheckboxSurveyDto).options) {
                    if (!(response as CheckboxSubmitSurveyDto).selected.includes(cb.id)) {
                        throw new BadRequestException('option selected not found')
                    }
                }
                break;
            case survey_category.options:
                for (const op of (item.data as unknown as OptionSurveyDto).options) {
                    if (!(op.id === (response as OptionSubmitSurveyDto).selected_id)) {
                        throw new BadRequestException('option selected not found')
                    }
                }
                break;
            default:
                break;
        }
    }
}
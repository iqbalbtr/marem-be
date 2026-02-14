import { PrismaService } from "@database/prisma.service";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { survey_category, survey_items, survey_reponse_item } from "@prisma";
import { BaseItemSurveyDto } from "../dto/create-survey.dto";
import { SurveyAnswerMap, SurveyItemMap } from "../survey.constant";
import { Cache } from "@nestjs/cache-manager";

export type StatisticSeriesSimple = {
    label: string;
    value: number;
    percentage: number;
};

export type StatisticSeriesComplex = {
    name: string;
    data: number[];
};

export type Statistic = {
    chart_type: 'line' | 'bar' | 'stacked_bar' | 'pie' | 'doughnut';
    labels: string[];
    series: StatisticSeriesSimple[] | StatisticSeriesComplex[];
};

export type StatisicItemSurvey = {
    title: string;
    category: survey_category;
    statistic: string[] | Statistic;
};

@Injectable() 
export class SurveyStatisticService {

    constructor(
        private readonly prismaService: PrismaService,
        @Inject('CACHE_MANAGER') private readonly cacheManager: Cache
    ) { }

    async getStatisticSubmission(surveyId: string) {
        const survey = await this.prismaService.surveys.findUnique({
            where: { id: surveyId },
            include: {
                survey_items: {
                    include: {
                        survey_reponse_item: true 
                    }
                },
            }
        });

        if (!survey) {
            throw new NotFoundException('Survey not found');
        }

        const lastResponse = await this.prismaService.survey_responses.findFirst({
            where: { survey_id: surveyId },
            orderBy: { updated_at: 'desc' },
            select: { updated_at: true }
        });

        const responseTime = lastResponse?.updated_at.getTime() ?? '0';
        const surveyTime = survey.updated_at.getTime();
        const cacheKey = `survey_stat:${surveyId}:s${surveyTime}:r${responseTime}`;

        const cachedStatistic = await this.cacheManager.get<{ survey_title: string; items: StatisicItemSurvey[] }>(cacheKey);
        if (cachedStatistic) {
            return cachedStatistic;
        }

        const mapedItems: StatisicItemSurvey[] = [];

        for (const item of survey.survey_items) {
            const statisticItem = this.statisticSurveItem(item, item.survey_reponse_item);
            mapedItems.push(statisticItem);
        }

        const result = {
            survey_title: survey.title,
            items: mapedItems
        };

        await this.cacheManager.set(cacheKey, result, 3600000);

        return result;
    }

    private statisticSurveItem(item: survey_items, responses: survey_reponse_item[]): StatisicItemSurvey {
        const questionData = item.data as unknown as BaseItemSurveyDto;

        switch (item.category) {
            case survey_category.answered:
            case survey_category.paragraph:
                return this.handleTextCategory(questionData, responses);

            case survey_category.checkboxes:
                return this.handleCheckboxesCategory(item as unknown as SurveyItemMap['checkboxes'], responses as unknown as SurveyAnswerMap['checkboxes'][]);

            case survey_category.date:
                return this.handleDateCategory(item as unknown as SurveyItemMap['date'], responses as unknown as SurveyAnswerMap['date'][]);

            case survey_category.rating:
                return this.handleRatingCategory(item as unknown as SurveyItemMap['rating'], responses as unknown as SurveyAnswerMap['rating'][]);

            case survey_category.options:
                return this.handleOptionsCategory(item as unknown as SurveyItemMap['options'], responses as unknown as SurveyAnswerMap['options'][]);

            default:
                return { category: item.category, title: questionData.title, statistic: [] };
        }
    }

    private handleTextCategory(questionData: BaseItemSurveyDto, responses: survey_reponse_item[]): StatisicItemSurvey {
        const textData = responses
            .map((rp: any) => rp.data?.response_text)
            .filter(text => text);

        return {
            category: questionData.category,
            title: questionData.title,
            statistic: textData
        };
    }

    private handleCheckboxesCategory(itemMap: SurveyItemMap['checkboxes'], responses: SurveyAnswerMap['checkboxes'][]): StatisicItemSurvey {
        const totalResponses = responses.length;

        const frequencyMap: Record<string, number> = {};
        for (const rs of responses) {
            if (rs.data?.selected) {
                Object.keys(rs.data.selected).forEach(optId => {
                    frequencyMap[optId] = (frequencyMap[optId] || 0) + 1;
                });
            }
        }

        const series = itemMap.data.options.map(opt => {
            const count = frequencyMap[opt.id] || 0;
            return {
                label: opt.text_option,
                value: count,
                percentage: totalResponses > 0 ? parseFloat(((count / totalResponses) * 100).toFixed(2)) : 0
            };
        });

        return {
            category: survey_category.checkboxes,
            title: itemMap.data.title,
            statistic: {
                chart_type: 'bar', 
                labels: itemMap.data.options.map(o => o.text_option),
                series: series
            }
        };
    }

    private handleDateCategory(itemMap: SurveyItemMap['date'], responses: SurveyAnswerMap['date'][]): StatisicItemSurvey {
        const totalResponses = responses.length;
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        const buckets = new Array(12).fill(0);

        for (const rs of responses) {
            if (rs.data?.response_date) {
                const date = new Date(rs.data.response_date);
                if (!isNaN(date.getTime())) {
                    buckets[date.getMonth()]++;
                }
            }
        }

        const series = buckets.map((count, index) => ({
            label: labels[index],
            value: count,
            percentage: totalResponses > 0 ? parseFloat(((count / totalResponses) * 100).toFixed(2)) : 0
        }));

        return {
            category: survey_category.date,
            title: itemMap.data.title,
            statistic: {
                chart_type: 'line', 
                labels: labels,
                series: series
            }
        };
    }

    private handleRatingCategory(itemMap: SurveyItemMap['rating'], responses: SurveyAnswerMap['rating'][]): StatisicItemSurvey {
        const totalResponses = responses.length;
        const labels = ['1', '2', '3', '4', '5']; 

        const buckets: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

        for (const rs of responses) {
            const rate = rs.data?.rate;
            if (rate && buckets[rate] !== undefined) {
                buckets[rate]++;
            }
        }

        const series = labels.map(label => {
            const count = buckets[label];
            return {
                label: `${label} Bintang`,
                value: count,
                percentage: totalResponses > 0 ? parseFloat(((count / totalResponses) * 100).toFixed(2)) : 0
            };
        });

        return {
            category: survey_category.rating,
            title: itemMap.data.title,
            statistic: {
                chart_type: 'bar',
                labels: labels,
                series: series
            }
        };
    }

    private handleOptionsCategory(itemMap: SurveyItemMap['options'], responses: SurveyAnswerMap['options'][]): StatisicItemSurvey {
        const totalResponses = responses.length;

        // 1. Hitung Frekuensi (O(N))
        const frequencyMap: Record<string, number> = {};
        for (const rs of responses) {
            const selectedId = rs.data?.selected_id;
            if (selectedId) {
                frequencyMap[selectedId] = (frequencyMap[selectedId] || 0) + 1;
            }
        }

        // 2. Map ke Series (O(M))
        const series = itemMap.data.options.map(opt => {
            const count = frequencyMap[opt.id] || 0;
            return {
                label: opt.text_option,
                value: count,
                percentage: totalResponses > 0 ? parseFloat(((count / totalResponses) * 100).toFixed(2)) : 0
            };
        });

        return {
            category: survey_category.options,
            title: itemMap.data.title,
            statistic: {
                chart_type: 'pie',
                labels: itemMap.data.options.map(o => o.text_option),
                series: series
            }
        };
    }
}
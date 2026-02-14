import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { BusinessProfileDto } from './dto/update-bussines.dto';
import { BusinessDevelopmentDto } from './dto/bussines-development.dto';
import { business_developments, Prisma } from '@prisma';
import CommonHelper from 'src/helpers/common.helper';

type GrowthData = {
    last_month_increase: string;
    last_period_increase: string;
    last_month_increase_percentage: string;
    last_period_increase_percentage: string;
};

type NumericGrowthKey = 'employees' | 'revenue' | 'capacity' | 'social_media_count' | 'legal_permit_count';

@Injectable()
export class BusinessService {

    constructor(private readonly prismaService: PrismaService) { }

    async updateBusinessProfile(userId: string, data: BusinessProfileDto) {
        const userBusiness = await this.prismaService.users.findFirst({
            where: { id: userId },
            include: { participant_profile: true },
        });

        if (!userBusiness) throw new NotFoundException('User not found');
        if (!userBusiness.participant_profile) throw new NotFoundException('User has no participant profile');
        if (userBusiness.role !== 'participant') throw new NotFoundException('Only participant can update business profile');

        return await this.prismaService.business_profile.upsert({
            where: {
                participant_profile_id: userBusiness.participant_profile.id,
            },
            create: {
                ...data,
                user_id: userId,
                participant_profile_id: userBusiness.participant_profile.id,
            },
            update: {
                ...data,
            },
        });
    }

    async addNewBusinessSnapshot(userId: string, data: BusinessDevelopmentDto) {

        const businessProfile = await this.getBusinessProfileByUserId(userId);

        return await this.prismaService.business_developments.create({
            data: {
                capacity: data.capacity,
                date: data.date,
                employees: data.employees,
                phase: data.phase,
                revenue: data.revenue,
                has_financial_records: data.has_financial_records ?? false,
                is_legalized: data.is_legalized ?? false,
                business_id: businessProfile.id,
                business_permits: data.bussines_permits as unknown as Prisma.JsonArray,
                social_media_marketing: data.social_medias as unknown as Prisma.JsonArray,
            },
        });
    }

    async getBusinessDevelopments(userId: string, asesor_id?: string) {
        const businessProfile = await this.getBusinessProfileByUserId(userId, asesor_id);

        const developments = await this.prismaService.business_developments.findMany({
            where: { business_id: businessProfile.id },
            orderBy: { date: 'asc' },
        });

        const summary: {
            growth: Partial<Record<NumericGrowthKey, GrowthData>>;
            statistics: {
                average_employee_count: number;
                total_developments: number;
            };
        } = {
            growth: {},
            statistics: {
                average_employee_count: 0,
                total_developments: developments.length,
            },
        };

        if (developments.length === 0) {
            return { developments, summary };
        }


        const currentRecord = {
            ...developments[developments.length - 1],
            social_media_count: (developments[developments.length - 1].social_media_marketing as object[]).length,
            legal_permit_count: (developments[developments.length - 1].business_permits as object[]).length,
        };
        const firstRecord = {
            ...developments[0],
            social_media_count: (developments[0].social_media_marketing as object[]).length,
            legal_permit_count: (developments[0].business_permits as object[]).length,
        };

        const currentDate = new Date(currentRecord.date);

        const targetLastMonth = developments.find((dev) => {
            const d = new Date(dev.date);
            return (
                d.getMonth() === currentDate.getMonth() - 1 &&
                d.getFullYear() === currentDate.getFullYear()
            );
        }) || developments[developments.length - 2] || firstRecord;

        const lastMonthRecord = {
            ...targetLastMonth,
            social_media_count: (targetLastMonth.social_media_marketing as object[]).length,
            legal_permit_count: (targetLastMonth.business_permits as object[]).length,
        };

        const totalEmployees = developments.reduce((sum, dev) => sum + dev.employees, 0);
        summary.statistics.average_employee_count = Math.round(totalEmployees / developments.length);

        const numericFields: NumericGrowthKey[] = ['revenue', 'employees', 'capacity', 'social_media_count', 'legal_permit_count'];

        numericFields.forEach((key) => {
            summary.growth[key] = this.calcGrowthData(
                key,
                firstRecord,
                lastMonthRecord,
                currentRecord
            );
        });

        const safeDevelopments = developments.map(({ business_permits, social_media_marketing, created_at, updated_at, ...dev }) => ({
            ...dev,
            revenue: Number(dev.revenue),
            capacity: Number(dev.capacity)
        }));

        const lastDevelopment = CommonHelper.getLastData(developments);

        return {
            developments: safeDevelopments,
            last_development: lastDevelopment,
            summary,
        };
    }

    private async getBusinessProfileByUserId(userId: string, asesor_id?: string) {
        const user = await this.prismaService.users.findFirst({
            where: { id: userId, participant_profile: { asesor_id } },
            include: {
                participant_profile: {
                    include: { business_profile: true },
                },
            },
        });

        if (!user) throw new NotFoundException('user not found');
        if (!user.participant_profile) throw new NotFoundException('participant profile not found');
        if (!user.participant_profile.business_profile) throw new NotFoundException('business profile not found');

        return user.participant_profile.business_profile;
    }

    private calcGrowthData(
        key: NumericGrowthKey,
        dataFirstPeriod: business_developments,
        dataLastMonth: business_developments,
        dataCurrent: business_developments,
    ): GrowthData {
        const valCurrent = this.toNumber(dataCurrent[key]);
        const valLastMonth = this.toNumber(dataLastMonth[key]);
        const valFirstPeriod = this.toNumber(dataFirstPeriod[key]);

        return {
            last_month_increase: this.prefixIndicator(valCurrent - valLastMonth),
            last_period_increase: this.prefixIndicator(valCurrent - valFirstPeriod),
            last_month_increase_percentage: this.prefixIndicator(this.calculatePercentage(valLastMonth, valCurrent), '%'),
            last_period_increase_percentage: this.prefixIndicator(this.calculatePercentage(valFirstPeriod, valCurrent), '%'),
        };
    }

    private calculatePercentage(oldValue: number, newValue: number): number {
        if (oldValue === 0) {
            return newValue === 0 ? 0 : 100;
        }
        return parseFloat((((newValue - oldValue) / oldValue) * 100).toFixed(2));
    }

    private toNumber(value: any): number {
        if (value && typeof value === 'object' && 'toNumber' in value) {
            return value.toNumber();
        }
        return Number(value || 0);
    }

    private prefixIndicator(value: number, endFix?: string): string {
        return (value > 0 ? `+${value}` : value < 0 ? `-${value}` : '0') + (endFix || '');
    }
}
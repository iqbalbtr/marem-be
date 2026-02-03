import { PrismaService } from '@database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { PaginationDto } from 'src/shared/pagination-dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { QueryCourseDto } from './dto/query-course.dtp';
import { Prisma } from '@prisma';

@Injectable()
export class CourseService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getAllCourses(query: QueryCourseDto) {

        let qBuilder = PaginationHelper.getWhereQuery('courses')

        if (query.classification) {
            qBuilder.classification = query.classification;
        }

        if (query.audience_target) {
            qBuilder.audience_target = query.audience_target;
        }

        return PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'courses',
            orderByQuery: {
                created_at: 'desc'
            },
            whereQuery: qBuilder
        })
    }

    async createCourse(data: CreateCourseDto) {

        if (data.target_mentor_ids && data.target_mentor_ids.length > 0) {
            await this.validateMentors(data.target_mentor_ids);
        }

        const createdCourse = await this.prismaService.courses.create({
            data: {
                title: data.title,
                description: data.description,
                classification: data.classification,
                is_published: data.is_published,
                audience_target: data.audience_target,
            }
        });
        return createdCourse;
    }

    async updateCourse(courseId: string, data: CreateCourseDto) {

        const exist = await this.prismaService.courses.findUnique({
            where: { id: courseId }
        });
        
        if (!exist) {
            throw new BadRequestException('course not found.');
        }

        if (data.target_mentor_ids && data.target_mentor_ids.length > 0) {
            await this.validateMentors(data.target_mentor_ids);
        }

        return this.prismaService.courses.update({
            where: { id: courseId },
            data: {
                title: data.title,
                description: data.description,
                classification: data.classification,
                is_published: data.is_published,
                audience_target: data.audience_target,
            }
        });
    }

    async deleteCourse(courseId: string) {

        const exist = await this.prismaService.courses.findUnique({
            where: { id: courseId }
        });
        if (!exist) {
            throw new BadRequestException('course not found.');
        }
        return this.prismaService.courses.delete({
            where: { id: courseId }
        });
    }

    private async validateMentors(mentorIds: string[]) {

        const allMentors = await this.prismaService.users.findMany({
            where: {
                id: { in: mentorIds },
                role: 'mentor'
            },
            include: {
                assesor_profile: true,
            }
        });

        if (allMentors.length !== mentorIds.length) {
            throw new BadRequestException('one or more mentor IDs are invalid.');
        }

        allMentors.forEach(mentor => {
            if (!mentor.assesor_profile) {
                throw new BadRequestException(`user with ID ${mentor.id} is not registered as an assesor.`);
            }
        });

    }
}

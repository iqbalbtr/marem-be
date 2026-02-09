import { PrismaService } from '@database/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { QueryCourseDto } from '../dto/query-course.dto';

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

        await this.validateMentors(data.mentor_id);

        const createdCourse = await this.prismaService.courses.create({
            data
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

        await this.validateMentors(data.mentor_id);

        return this.prismaService.courses.update({
            where: { id: courseId },
            data: data
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

    private async validateMentors(mentorId: string) {

        const count = await this.prismaService.users.count({
            where: {
                id: mentorId,
                role: {
                    in: ['mentor', 'admin', 'asesor']
                }
            }
        });

        if (count === 0) {
            throw new NotFoundException(`mentor with id ${mentorId} not found or invalid role.`);
        }
    }
}

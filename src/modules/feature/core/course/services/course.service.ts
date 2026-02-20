import { PrismaService } from '@database/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { QueryCourseDto } from '../dto/query-course.dto';
import { UserToken } from '@models/token.model';
import { courses, Prisma } from '@prisma';

type OptionListCourses = {
    whereClause: Prisma.coursesWhereInput,
    selectQuery?: Prisma.coursesSelect | null,
    transformData?: (data: Prisma.TypeMap['model']['courses']['operations']['findMany']['result']) => any
}

@Injectable()
export class CourseService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getAllCourses(query: QueryCourseDto, options?: OptionListCourses) {

        let qBuilder = PaginationHelper.getWhereQuery('courses', options?.whereClause);

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
            whereQuery: qBuilder,
            selectQuery: {
                id: true,
                title: true,
                description: true,
                course_type: true,
                classification: true,
                regional: true,
                created_at: true,
                updated_at: true,
                is_published: true,
                asesor: {
                    select: { id: true, name: true, email: true, profile: true }
                },
                ...(options?.selectQuery || {})
            },
            transformData: data => options?.transformData ? options.transformData(data as any) : data
        })
    }

    async getCourseDetail(courseId: string, whereClause: Prisma.coursesWhereInput = {}) {

        const course = await this.prismaService.courses.findUnique({
            where: {
                ...whereClause,
                id: courseId
            },
            include: {
                modules: {
                    include: {
                        items: true
                    }
                },
                asesor: {
                    select: {
                        id: true,
                        name: true,
                        profile: true,
                        email: true,
                    }
                }
            }
        })

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return course
    }

    async createCourse(data: CreateCourseDto) {

        await this.validateMentors(data.asesor_id);

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

        await this.validateMentors(data.asesor_id);

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
                    in: ['admin', 'asesor']
                }
            }
        });

        if (count === 0) {
            throw new NotFoundException(`mentor with id ${mentorId} not found or invalid role.`);
        }
    }
}

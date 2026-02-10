import { PrismaService } from '@database/prisma.service';
import { UserToken } from '@models/token.model';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class TeachingCourseService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getCourses(user: UserToken, query: PaginationDto) {
        
        const qBuilder = PaginationHelper.getWhereQuery('courses', {
            mentor_id: user.user_id,
        });

        if (query.search) {
            qBuilder.AND = [
                {
                    OR: [
                        { title: { contains: query.search, mode: 'insensitive' } },
                        {description: { contains: query.search, mode: 'insensitive' } }
                    ]
                }
            ];
        }

        const learnings = await PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'courses',
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
                mentor: {
                    select: { id: true, name: true, email: true, profile: true }
                }
            }
        });

        return learnings
    }

    async getCourseModule(user: UserToken,  courseId: string) {
        await this.valdateCourseAccess(user.user_id, courseId);

        const modules = await this.prismaService.course_modules.findMany({
            where: {
                course_id: courseId,
                course: { mentor_id: user.user_id}
            },
            orderBy: { sequence: 'asc' }
        });

        return modules
    }

    async getCourseModuleItems(user: UserToken, courseId: string, moduleId: string) {
        await this.valdateCourseAccess(user.user_id, courseId);

        const items = await this.prismaService.course_module_items.findMany({
            where: {
                module_id: moduleId,
                module: { course: { mentor_id: user.user_id } }
            },
            select: {
                id: true,
                title: true,
                category: true,
                created_at: true,
                sequence: true,
                is_published: true,
            },
            orderBy: { sequence: 'asc' }
        });

        return items
    }

    async getMaterialContent(user: UserToken, courseId: string, itemId: string) {
        await this.valdateCourseAccess(user.user_id, courseId);

        const data =  await this.prismaService.course_module_items.findFirst({
            where: {
                id: itemId,
                module: { course: { mentor_id: user.user_id } }
            }
        });

        return data
    }

   private async valdateCourseAccess(userId: string, courseId: string) {
        const enrollment = await this.prismaService.courses.findFirst({
            where: {
                mentor_id: userId,
                id: courseId
            }
        });
        if (!enrollment) {
            throw new BadRequestException('Mentor is not assigned to the course');
        }
    }
}
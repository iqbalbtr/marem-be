import { PrismaService } from '@database/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto, QuizDataDto, QuizOptionDto } from '../dto/create-module.dto';
import { Prisma } from '@prisma';

@Injectable()
export class ModuleService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async createModule(courseId: string, data: CreateModuleDto) {

        await this.validateCourseExistence(courseId);
        
        await this.prismaService.$transaction(async (tx) => {
            
            for (const mod of data.modules) {
                this.validateDuplicateSequence(mod.items.map(i => i.sequence));
                for (const item of mod.items) {
                    this.validateDuplicateSequence(mod.items.map(i => i.sequence));
                    if (item.category === 'quiz') {
                        const questions = (item.data as QuizDataDto).questions
                        for (const option of questions) {
                            this.validateQuizItems(option.options);
                        }
                    }
                }
            }

            const incomingModuleIds = data.modules.map(m => m.id);

            await tx.course_modules.deleteMany({
                where: {
                    course_id: courseId,
                    id: { notIn: incomingModuleIds }
                }
            });

            for (const mod of data.modules) {
                
                this.validateDuplicateSequence(mod.items.map(i => i.sequence));

                await tx.course_modules.upsert({
                    where: { id: mod.id },
                    create: {
                        id: mod.id,
                        course_id: courseId,
                        title: mod.title,
                        description: mod.description,
                        sequence: mod.sequence,
                    },
                    update: {
                        title: mod.title,
                        description: mod.description,
                        sequence: mod.sequence,
                    }
                });

                const incomingItemIds = mod.items.map(i => i.id);

                await tx.course_module_items.deleteMany({
                    where: {
                        module_id: mod.id,
                        id: { notIn: incomingItemIds }
                    }
                });

                await Promise.all(mod.items.map(item =>
                    tx.course_module_items.upsert({
                        where: { id: item.id },
                        create: {
                            id: item.id,
                            module_id: mod.id,
                            title: item.title,
                            category: item.category,
                            sequence: item.sequence,
                            data: item.data as unknown as Prisma.JsonObject,
                            is_published: item.is_published
                        },
                        update: {
                            title: item.title,
                            category: item.category,
                            sequence: item.sequence,
                            data: item.data as unknown as Prisma.JsonObject,
                            is_published: item.is_published
                        }
                    })
                ));
            }
        });
    }

    async getCourseModules(courseId: string) {
        await this.validateCourseExistence(courseId);
        
        return this.prismaService.course_modules.findMany({
            where: { course_id: courseId },
            orderBy: {
                sequence: 'asc'
            }
        });
    }

    async getModuleItems(courseId: string, moduleId: string) {
        await this.validateCourseExistence(courseId);
        return this.prismaService.course_module_items.findMany({
            where: { module_id: moduleId },
            select: {
                id: true,
                module_id: true,
                title: true,
                category: true,
                sequence: true,
                is_published: true,
            },
            orderBy: {
                sequence: 'asc'
            }
        });
    }

    async getModuleItemById(courseId: string, itemId: string, moduleId: string) {
        await this.validateCourseExistence(courseId);

        const res = await this.prismaService.course_module_items.findUnique({
            where: { id: itemId, module_id: moduleId },
        });

        if (!res) {
            throw new BadRequestException('module item not found.');
        }

        return res;
    }

    private async validateCourseExistence(courseId: string) {
        const count = await this.prismaService.courses.count({
            where: { id: courseId }
        });
        if (count === 0) {
            throw new BadRequestException('course not found.');
        }
    }

    private validateDuplicateSequence(sequences: number[]) {
        const unique = new Set(sequences);
        if (unique.size !== sequences.length) {
            throw new BadRequestException('duplicate sequence found.');
        }
    }

    private validateQuizItems(items: QuizOptionDto[]) {
        if(items.filter(i => i.is_correct).length === 0) {
            throw new BadRequestException('at least one answer must be selected.');
        }
    }
}
import { PrismaService } from "@database/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { course_module_items, Prisma } from "@prisma";

@Injectable()
export class LearningCourseProgressService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }


    async validateSequenceAccess(userId: string, currentItem: course_module_items) {

        if (currentItem.sequence === 1) return;

        const previousItem = await this.prismaService.course_module_items.findFirst({
            where: {
                module_id: currentItem.module_id,
                sequence: { lt: currentItem.sequence }
            },
            orderBy: { sequence: 'desc' },
            include: {
                course_module_item_completions: {
                    where: { user_id: userId }
                }
            }
        });

        if (previousItem && previousItem.course_module_item_completions.length === 0) {
            throw new BadRequestException('Please complete the previous material first.');
        }
    }

    public async checkAndCompleteModule(tx: Prisma.TransactionClient, userId: string, moduleId: string) {
        const [totalItems, completedItems] = await Promise.all([
            tx.course_module_items.count({ where: { module_id: moduleId } }),
            tx.course_module_item_completions.count({
                where: {
                    user_id: userId,
                    item: { module_id: moduleId }
                }
            })
        ]);

        if (completedItems >= totalItems) {
            const exists = await tx.course_module_completions.findUnique({
                where: { user_id_module_id: { user_id: userId, module_id: moduleId } }
            });
            if (!exists) {
                await tx.course_module_completions.create({
                    data: { user_id: userId, module_id: moduleId }
                });
            }
        }
    }

    public async checkAndCompleteCourse(tx: Prisma.TransactionClient, userId: string, courseId: string) {
        const [totalModules, completedModules] = await Promise.all([
            tx.course_modules.count({ where: { course_id: courseId } }),
            tx.course_module_completions.count({
                where: {
                    user_id: userId,
                    module: { course_id: courseId }
                }
            })
        ]);

        if (completedModules >= totalModules) {
            await tx.courses_participants.updateMany({
                where: {
                    user_id: userId,
                    course_id: courseId,
                    finished_at: null
                },
                data: { finished_at: new Date() }
            });
        }
    }
}
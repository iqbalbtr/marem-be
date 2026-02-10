import { PrismaService } from "@database/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { assesor_profile } from "@prisma";

export class TeachingAccessService {

    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async findAssessorItemWithAccess(itemId: string, profile: assesor_profile | null | undefined) {
        if (!profile) {
            throw new NotFoundException('Assessor profile not found for access check');
        }
        const item = await this.prismaService.course_module_items.findFirst({
            where: {
                id: itemId,
                module: {
                    course: {
                        mentor_id: profile.user_id
                    }
                }
            }
        });

        if (!item) throw new NotFoundException('Material not found or access denied');
        return item;
    }

    public async getUserInfo(userId: string) {
        const user = await this.prismaService.users.findUnique({
            where: { id: userId, role: {in: ['admin', 'asesor', 'mentor']} },
            include: { assesor_profile: true }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.assesor_profile) {
            throw new NotFoundException('asesor profile not found for user');
        }

        return user;
    }
}
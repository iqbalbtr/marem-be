import { PrismaService } from "@database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { assesor_profile, course_type, participant_profile, Prisma, user_role } from "@prisma";

@Injectable()
export class LearningAccessService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    public getQueryLearningAccess(profile: participant_profile | null | undefined): Prisma.coursesWhereInput {
        if (!profile) {
            throw new NotFoundException('Participant profile not found for access query');
        }
        return {
            OR: [
                { course_type: course_type.elective, classification: profile?.clasification },
                { course_type: course_type.mandatory, regional: profile?.province }
            ]
        };
    }

    public getCoachingAccessQuery(profile: participant_profile | null | undefined): Prisma.coaching_sessionWhereInput {
        return {
            OR: [
                { regional: profile?.province },
                { classification: profile?.clasification }
            ]
        }
    }

    public async findParticipantItemWithAccess(itemId: string, profile: participant_profile | null | undefined) {
        if (!profile) {
            throw new NotFoundException('Participant profile not found for access check');
        }
        const item = await this.prismaService.course_module_items.findFirst({
            where: {
                id: itemId,
                module: { course: this.getQueryLearningAccess(profile) }
            },
            include: {
                course_module_item_completions: {
                    where: { user_id: profile.user_id },
                    take: 1
                }
            }
        });

        if (!item) throw new NotFoundException('Material not found or access denied');
        return item;
    }

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

    public async getUserInfo(userId: string, role: user_role = 'participant') {
        const user = await this.prismaService.users.findUnique({
            where: { id: userId, role: role },
            include: { participant_profile: true, assesor_profile: true }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        switch (role) {
            case user_role.participant:
                if (!user.participant_profile) {
                    throw new NotFoundException('Participant profile not found for user');
                }
                break;
            case user_role.asesor:
                if (!user.assesor_profile) {
                    throw new NotFoundException('Assessor profile not found for user');
                }
                break;
            default:
                break;
        }

        return user;
    }
}
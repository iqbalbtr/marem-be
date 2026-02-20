import { PrismaService } from "@database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { assesor_profile, course_type, participant_profile, Prisma, user_role } from "@prisma";

@Injectable()
export class LearningCourseAccessService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    public getQueryCourseAccess(profile: participant_profile | null | undefined): Prisma.coursesWhereInput {
        if (!profile) {
            throw new NotFoundException('Participant profile not found for access query');
        }
        return {
            OR: [
                { course_type: course_type.elective, classification: profile?.clasification },
                { course_type: course_type.mandatory, regional: profile?.province }
            ],
            stage: profile?.stage
        };
    }

    public getCoachingAccessQuery(profile: participant_profile | null | undefined): Prisma.coaching_sessionWhereInput {
        return {
            OR: [
                { regional: profile?.province },
                { classification: profile?.clasification }
            ],
            stage: profile?.stage
        }
    }

    public async findParticipantItemWithAccess(itemId: string, profile: participant_profile | null | undefined, withSubmission = false) {
        if (!profile) {
            throw new NotFoundException('Participant profile not found for access check');
        }
        const item = await this.prismaService.course_module_items.findFirst({
            where: {
                id: itemId,
                module: { course: this.getQueryCourseAccess(profile) }
            },
            include: {
                course_module_item_completions: {
                    where: { user_id: profile.user_id },
                    take: 1
                },
                module: true,
                submissions: withSubmission ? {
                    where: { user_id: profile.user_id },
                    take: 1
                } : false
            }
        });

        if (!item) throw new NotFoundException('Material not found or access denied');
        return item;
    }

    public async getUserInfo(userId: string) {
        const user = await this.prismaService.users.findUnique({
            where: { id: userId, role: { in: ['admin', 'participant'] } },
            include: { participant_profile: true }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.participant_profile) {
            throw new NotFoundException('Participant profile not found for user');
        }


        return user;
    }
}
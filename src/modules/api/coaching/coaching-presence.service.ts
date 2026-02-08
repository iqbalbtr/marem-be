import { PrismaService } from "@database/prisma.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { coaching_session, coaching_type, Prisma } from "@prisma"; 
import { PaginationHelper } from "src/helpers/pagination.helper";
import { PaginationDto } from "src/shared/pagination-dto";
import { MarkPresenceDto } from "./dto/mark-presence.dto";

@Injectable()
export class CoachingPresenceService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getCoachingPresence(coachingId: string, query: PaginationDto) {
        const coaching = await this.getCoachingById(coachingId);
        
        const whereQuery = await this.getQueryCoachingParticipants(coaching);

        const result = await PaginationHelper.createPaginationData({
            page: query.page,
            per_page: query.limit,
            prismaService: this.prismaService,
            table: 'users',
            whereQuery: whereQuery,
            includeQuery: {
                coaching_presences: {
                    where: {
                        session_id: coachingId
                    },
                    take: 1
                },
                participant_profile: true 
            },
            orderByQuery: {
                name: 'asc' 
            }
        });

        const presenceData = result.data.map((user: any) => {
            const existingPresence = user.coaching_presences?.[0];

            if (!existingPresence) {
                return {
                    id: null, 
                    session_id: coachingId,
                    participant_id: user.id,
                    status: 'absent',
                    created_at: null,
                    updated_at: null,
                    feedback_notes: null,
                    joined_at: null,
                    user: { 
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        profile: user.profile,
                        participant_info: user.participant_profile 
                    }
                };
            } else {
                return {
                    ...existingPresence, 
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        profile: user.profile,
                        participant_info: user.participant_profile 
                    }
                };
            }
        });

        return {
            ...result,
            data: presenceData
        };
    }

    async markPresence(coachingId: string, body: MarkPresenceDto) {
        const coaching = await this.getCoachingById(coachingId);
        const userQuery = await this.getQueryCoachingParticipants(coaching);
        
        const finalQuery: Prisma.usersWhereInput = {
            ...userQuery,
            id: body.participant_id
        };

        const userCount = await this.prismaService.users.count({
            where: finalQuery
        });

        if (userCount === 0) {
            throw new NotFoundException('Participant valid not found in this coaching session');
        }

        return this.prismaService.coaching_presence.upsert({
            where: {
                session_id_participant_id: {
                    session_id: coachingId,
                    participant_id: body.participant_id
                }
            },
            create: {
                session_id: coachingId,
                ...body
            },
            update: {
                ...body
            }
        });
    }

    async joinCoachingSession(coachingId: string, participantId: string) {
        const coaching = await this.getCoachingById(coachingId);
        
        const userQuery = await this.getQueryCoachingParticipants(coaching);
        const finalQuery: Prisma.usersWhereInput = {
            ...userQuery,
            id: participantId
        };

        const userCount = await this.prismaService.users.count({
            where: finalQuery
        });

        if (userCount === 0) {
            throw new NotFoundException('You are not eligible for this coaching session');
        }

        await this.prismaService.coaching_presence.upsert({
            where: {
                session_id_participant_id: {
                    session_id: coachingId,
                    participant_id: participantId
                },
            },
            create: {
                session_id: coachingId,
                participant_id: participantId,
                status: 'present',
                joined_at: new Date(),
                first_joined_at: new Date(), 
            },
            update: {
                status: 'present',
                joined_at: new Date(), 
            }
        });

        return {
            platform: coaching.meeting_platform,
            link: coaching.meeting_link,
            password: coaching.meeting_password,
        };
    }

    private async getQueryCoachingParticipants(coaching: coaching_session): Promise<Prisma.usersWhereInput> {

        const baseQuery: Prisma.usersWhereInput = {
            role: 'participant',
        };

        if (coaching.coaching_type === coaching_type.regional) {
            if (!coaching.regional) {
                throw new BadRequestException('Coaching type is regional but regional data is missing');
            }
            return {
                ...baseQuery,
                participant_profile: {
                    province: coaching.regional 
                }
            };
        } 
        
        else if (coaching.coaching_type === coaching_type.classification) {
            if (!coaching.classification) {
                throw new BadRequestException('Coaching type is classification but data is missing');
            }
            return {
                ...baseQuery,
                participant_profile: {
                    clasification: coaching.classification
                }
            };
        }
        return baseQuery;
    }

    private async getCoachingById(coachingId: string) {
        const coaching = await this.prismaService.coaching_session.findUnique({
            where: { id: coachingId }
        });
        if (!coaching) {
            throw new NotFoundException('Coaching session not found');
        }
        return coaching;
    }
}
import { PrismaService } from '@database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BatchParticipantProfileDto } from './dto/bussiness-profile.dto';
import { StorageUtils } from '@utils/storage.util';
import { PrivateExpertiseProfileDto, PublicExpertiseProfileDto } from './dto/expertise-profile.dto';
import { user_role } from '@prisma';

@Injectable()
export class ProfileService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async updateBussinessProfile(userId: string, businessProfile: BatchParticipantProfileDto) {

    // Akses model 'users' (sesuai nama model di schema)
    const user = await this.prismaService.users.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!["participant"].includes(user.role)) {
      throw new NotFoundException('only participant data can update business profile');
    }

    const { participant_profile, participat_bussiness, profile } = businessProfile

    return await this.prismaService.$transaction(async (prisma) => {

      const imagePath = profile ? StorageUtils.moveFiles([profile], `/users/${userId}/profile`) : null;
      if (profile) StorageUtils.compareFileLists([profile], imagePath || []);
      const updatedUser = await prisma.users.update({
        where: {
          id: userId
        },
        data: {
          profile: imagePath ? imagePath[0] : user.profile,
          gender: participant_profile.gender,
          is_verified: true,
          participant_profile: {
            upsert: {
              create: {
                start_year: participant_profile.start_year,
                last_education: participant_profile.last_education,
                city: participat_bussiness.city,
                clasification: participant_profile.clasification,
                nik: participant_profile.nik,
                npwp: participant_profile.npwp,
                postal_code: participat_bussiness.postal_code,
                province: participat_bussiness.province,
                source_joined: participat_bussiness.source_joined,
                street: participat_bussiness.street,
              },
              update: {
                start_year: participant_profile.start_year,
                last_education: participant_profile.last_education,
                city: participat_bussiness.city,
                clasification: participant_profile.clasification,
                nik: participant_profile.nik,
                npwp: participant_profile.npwp,
                postal_code: participat_bussiness.postal_code,
                province: participat_bussiness.province,
                source_joined: participat_bussiness.source_joined,
                street: participat_bussiness.street,
              }
            }
          }

        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profile: true,
          participant_profile: true
        }
      })

      return {
        ...updatedUser
      }
    })
  }

  async updateExpertisePublicProfile(userId: string, expertiseProfile: PublicExpertiseProfileDto) {

    // Akses model 'users'
    const user = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        assesor_profile: true // Relasi snake_case
      }
    })

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!["asesor", "mentor"].includes(user.role)) {
      throw new NotFoundException('only asesor can update asesor profile');
    }

    // Cek ketersediaan profile (snake_case)
    if (!user.assesor_profile) {
      throw new NotFoundException('please complete asesor private profile first');
    }

    return await this.prismaService.$transaction(async prisma => {

      let imagePath = user.profile ? [user.profile] : [];

      if (expertiseProfile.profile) {
        imagePath = StorageUtils.moveFiles([expertiseProfile.profile], `/users/${userId}/profile`);
        StorageUtils.compareFileLists([expertiseProfile.profile], imagePath);
      }

      await prisma.users.update({
        where: {
          id: userId
        },
        data: {
          name: expertiseProfile.name,
          profile: imagePath.length > 0 ? imagePath[0] : user.profile,
          role: expertiseProfile.role as unknown as user_role,
        }
      })

      // Akses model 'assesor_profile'
      return await prisma.assesor_profile.update({
        where: {
          user_id: userId // Field snake_case
        },
        data: {
          position: expertiseProfile.position,
          organization: expertiseProfile.organization,
          specialization: expertiseProfile.specialization,
          bio: expertiseProfile.bio,
          portofolio: expertiseProfile.portofolio,

          // Mapping DTO (camelCase) ke DB (snake_case)
          linked_in: expertiseProfile.linkedIn,
        },
      })
    })
  }

  async updateExpertiePrivateProfile(userId: string, experienceProfile: PrivateExpertiseProfileDto) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        assesor_profile: true
      }
    })

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!["asesor", "mentor"].includes(user.role)) {
      throw new NotFoundException('only asesor can update asesor profile');
    }

    return await this.prismaService.$transaction(async prisma => {
      const [profile] = await Promise.all([
        // Akses model 'assesor_profile'
        prisma.assesor_profile.upsert({
          where: {
            user_id: userId
          },
          create: {
            user_id: userId,
            phone: experienceProfile.phone,
            email: experienceProfile.email,

            // Field DB snake_case
            account_number: experienceProfile.account_number,
            account_name: experienceProfile.account_name,

            nik: experienceProfile.nik,
            organization: experienceProfile.organization || '',
            position: experienceProfile.position || '',
            specialization: experienceProfile.specialization || '',
          },
          update: {
            phone: experienceProfile.phone,
            email: experienceProfile.email,
            account_number: experienceProfile.account_number,
            account_name: experienceProfile.account_name,
            organization: experienceProfile.organization || '',
            position: experienceProfile.position || '',
            specialization: experienceProfile.specialization || '',
          }
        }),

        // Akses model 'users'
        prisma.users.update({
          where: {
            id: userId
          },
          data: {
            is_verified: true,
          }
        })
      ])

      return profile;
    })
  }
}
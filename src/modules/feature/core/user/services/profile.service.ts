import { PrismaService } from '@database/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BatchParticipantProfileDto } from '../dto/bussiness-profile.dto';
import { StorageUtils } from '@utils/storage.util';
import { UpdateProfileExpertiseDto } from '../dto/expertise-profile.dto';

@Injectable()
export class ProfileService {

  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async updateBussinessProfile(userId: string, businessProfile: BatchParticipantProfileDto) {

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

    const { participant_profile, participat_bussiness, profile, name } = businessProfile

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
          name: name,
          is_verified: true,
          participant_profile: {
            upsert: {
              create: {
                start_year: participat_bussiness.start_year,
                last_education: participant_profile.last_education,
                city: participat_bussiness.city,
                clasification: participant_profile.clasification,
                nik: participant_profile.nik,
                npwp: participant_profile.npwp,
                postal_code: participat_bussiness.postal_code,
                province: participat_bussiness.province,
                source_joined: participat_bussiness.source_joined,
                street: participat_bussiness.street,
                stage: participant_profile.stage,
                asesor_id: participant_profile.asesor_id,
              },
              update: {
                start_year: participat_bussiness.start_year,
                last_education: participant_profile.last_education,
                city: participat_bussiness.city,
                clasification: participant_profile.clasification,
                nik: participant_profile.nik,
                npwp: participant_profile.npwp,
                postal_code: participat_bussiness.postal_code,
                province: participat_bussiness.province,
                source_joined: participat_bussiness.source_joined,
                street: participat_bussiness.street,
                stage: participant_profile.stage,
                asesor_id: participant_profile.asesor_id,
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

  async updateExpertiseProfile(userId: string, expertiseProfile: UpdateProfileExpertiseDto) {
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

      let imagePath = user.profile ? [user.profile] : [];

      const { profile, name, private: privateProfile, public: publicProfile } = expertiseProfile

      if (profile) {
        imagePath = StorageUtils.moveFiles([profile], `/users/${userId}/profile`);
        StorageUtils.compareFileLists([profile], imagePath);
      }

      await prisma.users.update({
        where: {
          id: userId
        },
        data: {
          name: name,
          profile: imagePath.length > 0 ? imagePath[0] : user.profile,
        }
      })

      return await prisma.assesor_profile.upsert({
        where: {
          user_id: userId
        },
        create: {
          position: publicProfile.position,
          organization: publicProfile.organization,
          specialization: publicProfile.specialization,
          bio: publicProfile.bio,
          portofolio: publicProfile.portofolio,
          linked_in: publicProfile.linkedIn,
          user_id: userId,
          phone: privateProfile.phone,
          email: privateProfile.email,
          account_number: privateProfile.account_number,
          account_name: privateProfile.account_name,
          nik: privateProfile.nik,
        },
        update: {
          position: publicProfile.position,
          organization: publicProfile.organization,
          specialization: publicProfile.specialization,
          bio: publicProfile.bio,
          portofolio: publicProfile.portofolio,
          linked_in: publicProfile.linkedIn,
          phone: privateProfile.phone,
          email: privateProfile.email,
          account_number: privateProfile.account_number,
          account_name: privateProfile.account_name,
        }
      })
    })
  }
}
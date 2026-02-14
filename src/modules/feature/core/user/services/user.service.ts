import { PrismaService } from '@database/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserQueryDto } from '../dto/user-query.dto';
import { PaginationHelper } from 'src/helpers/pagination.helper';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/modules/mail/mail.service';
import { PermissionHelper } from 'src/helpers/permission.helper';
import { UserToken } from '@models/token.model';
import { Prisma } from '@prisma';

@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) { }

  async findAll(query: UserQueryDto) {

    let queryBuilder = PaginationHelper.getWhereQuery('users', {
      OR: [
        { name: { contains: query.search || '' } },
        { email: { contains: query.search || '' } },
      ]
    })

    if (query.role) {
      queryBuilder.role = query.role;
    }

    if (query.gender) {
      queryBuilder.gender = query.gender
    }

    if(query.asesor_id){
      queryBuilder.participant_profile = {
        asesor_id: query.asesor_id
      }
    }

    return PaginationHelper.createPaginationData({
      page: query.page,
      per_page: query.limit,
      prismaService: this.prismaService,
      table: 'users',
      whereQuery: queryBuilder,
      selectQuery: {
        id: true,
        email: true,
        role: true,
        profile: true,
        is_active: true,
        is_verified: true,
      }
    })
  }

  async findOne(id: string, whereClause: Prisma.usersWhereInput = {}) {
    const res = await this.prismaService.users.findFirst({
      where: {
        ...whereClause,
        id: id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
        is_active: true,
        is_verified: true,
        gender: true,
        assesor_profile: true,
        participant_profile: {
          include: {
            business_profile: true
          }
        },
      }
    });

    if (!res) {
      throw new NotFoundException('user not found');
    }

    return res;
  }

  async createUser(data: UpdateUserDto) {
    const emailExist = await this.prismaService.users.count({
      where: {
        email: data.email
      }
    });

    if (emailExist > 0) {
      throw new NotFoundException('email already used');
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.users.create({
      data: {
        name: '',
        email: data.email,
        gender: 'unknown',
        role: data.role,
        password: password
      },
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
        is_verified: true,
      }
    });

    await this.mailService.sendVerificationAccount(data.email, data.password!);

    return user;
  }

  async update(userToken: UserToken, id: string, data: UpdateUserDto) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!PermissionHelper.canManageResource(userToken, id)) {
      throw new ForbiddenException('you dont have permission to update this user');
    }

    if (data.email && data.email !== user.email) {
      const emailExist = await this.prismaService.users.count({
        where: {
          email: data.email
        }
      });
      if (emailExist > 0) {
        throw new NotFoundException('email already used');
      }
    }

    let password: string | undefined = user.password;

    if (data.password) {
      password = await bcrypt.hash(data.password, 10);
    }

    return await this.prismaService.users.update({
      where: {
        id: id
      },
      data: {
        name: '',
        email: data.email,
        gender: 'unknown',
        role: data.role,
        password: password
      },
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
        is_verified: true,
      }
    });
  }

  async deleteUser(id: string) {
    const count = await this.prismaService.users.count({
      where: {
        id: id
      }
    });
    if (count === 0) {
      throw new NotFoundException('user not found');
    }
    await this.prismaService.users.delete({
      where: {
        id: id
      }
    });

    return true
  }
}
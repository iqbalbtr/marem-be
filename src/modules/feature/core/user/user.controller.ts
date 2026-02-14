import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { UserService } from './services/user.service';
import { UserQueryDto } from './dto/user-query.dto';
import { Utils } from '@utils/index';
import { UpdateUserDto } from './dto/update-user.dto';
import { BatchParticipantProfileDto } from './dto/bussiness-profile.dto';
import { PrivateExpertiseProfileDto, PublicExpertiseProfileDto, UpdateProfileExpertiseDto } from './dto/expertise-profile.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { CheckOwnership } from '@decorators/check-ownership.decorator';
import { UserReportService } from './services/user-report.service';

@UseGuards(AuthGuard)
@Controller('/api/users')
export class UserController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly userReportService: UserReportService,
  ) { }

  @Role("admin")
  @Get()
  async getAllUsers(
    @Query() query: UserQueryDto,
  ) {
    const { data, pagination } = await this.userService.findAll(query);
    return Utils.ResponseSuccess('success', data, pagination);
  }

  @Role("admin")
  @Post()
  async createUser(
    @Body() body: UpdateUserDto,
  ) {
    const res = await this.userService.createUser(body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role("admin")
  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ) {
    const res = await this.userService.findOne(id);
    return Utils.ResponseSuccess('success', res);
  }

  @Role("admin")
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @User() currentUser: UserToken,
  ) {
    const res = await this.userService.update(currentUser, id, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role("admin")
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  ) {
    await this.userService.deleteUser(id);
    return Utils.ResponseSuccess('success');
  }

  @Role(["admin", "participant"])
  @CheckOwnership('userId', 'params', ['admin'])
  @Patch(':userId/business-profile')
  async updateBusinessProfile(
    @Param('userId') userId: string,
    @Body() body: BatchParticipantProfileDto,
  ) {
    const res = await this.profileService.updateBussinessProfile(userId, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(["admin", "asesor"])
  @CheckOwnership('userId', 'params', ['admin'])
  @Patch(':userId/expertise-profile')
  async updateExpertiseProfile(
    @Param('userId') userId: string,
    @Body() body: UpdateProfileExpertiseDto,
  ) {
    const res = await this.profileService.updateExpertiseProfile(userId, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(["admin", "participant", "asesor"])
  @CheckOwnership('userId', 'params', ['admin', 'asesor'])
  @Get(':userId/report')
  async getUserReport(
    @Param('userId') userId: string,
  ) {
    const userInfo = await this.userReportService.getUserReport(userId);
    return Utils.ResponseSuccess('success', userInfo);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { UserQueryDto } from './dto/user-query.dto';
import { Utils } from '@utils/index';
import { UpdateUserDto } from './dto/update-user.dto';
import { BatchParticipantProfileDto } from './dto/bussiness-profile.dto';
import { PrivateExpertiseProfileDto, PublicExpertiseProfileDto } from './dto/expertise-profile.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller('/api/users')
export class UserController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
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
  ) {
    const res = await this.userService.update(id, body);
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
  @Patch(':id/business-profile')
  async updateBusinessProfile(
    @Param('id') id: string,
    @Body() body: BatchParticipantProfileDto,
  ) {
    const res = await this.profileService.updateBussinessProfile(id, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(["admin", "asesor"])
  @Patch(':id/expertise-profile/public')
  async updateExpertiseProfile(
    @Param('id') id: string,
    @Body() body: PublicExpertiseProfileDto,
  ) {
    const res = await this.profileService.updateExpertisePublicProfile(id, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(["admin", "asesor"])
  @Patch(':id/expertise-profile/private')
  async updateExpertisePrivateProfile(
    @Param('id') id: string,
    @Body() body: PrivateExpertiseProfileDto,
  ) {
    const res = await this.profileService.updateExpertiePrivateProfile(id, body);
    return Utils.ResponseSuccess('success', res);
  }

}

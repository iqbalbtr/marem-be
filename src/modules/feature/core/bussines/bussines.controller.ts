import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from './bussines.service';
import { BusinessDevelopmentDto } from './dto/bussines-development.dto';
import { Utils } from '@utils/index';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';
import { BusinessProfileDto } from './dto/update-bussines.dto';
import { CheckOwnership } from '@decorators/check-ownership.decorator';

@UseGuards(AuthGuard)
@Role(["participant", 'admin'])
@CheckOwnership('userId', 'params', ['admin'])
@Controller('/api/users/:userId/bussines')
export class BussinesController {

  constructor(private readonly businesService: BusinessService) { }

  @Patch('profile')
  async updateBusinessProfile(
    @Param('userId') userId: string,
    @Body() data: BusinessProfileDto
  ) {
    const res = await this.businesService.updateBusinessProfile(userId, data);
    return Utils.ResponseSuccess('success', res);
  }

  @Post('snapshots')
  async addNewBusinessSnapshot(
    @Param('userId') userId: string,
    @Body() data: BusinessDevelopmentDto
  ) {
    const res = await this.businesService.addNewBusinessSnapshot(userId, data);
    return Utils.ResponseSuccess('success', res);
  }

  @Get('summary') 
  async getBusinessSummary(
    @Param('userId') userId: string
  ) {
    const res = await this.businesService.getBusinessDevelopments(userId);
    return Utils.ResponseSuccess('success', res);
  }
}

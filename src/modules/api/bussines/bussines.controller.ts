import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { BusinessService } from './bussines.service';
import { BusinessDevelopmentDto } from './dto/bussines-development.dto';
import { Utils } from '@utils/index';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller('/api/users/:userId/bussines')
export class BussinesController {

  constructor(private readonly businesService: BusinessService) { }

  @Role(["participant", 'admin'])
  @Patch('profile')
  async updateBusinessProfile(
    @Param('userId') userId: string,
    @Body() data: any
  ) {
    const res = await this.businesService.updateBusinessProfile(userId, data);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(["participant", 'admin'])
  @Patch('snapshot')
  async addNewBusinessSnapshot(
    @Param('userId') userId: string,
    @Body() data: BusinessDevelopmentDto
  ) {
    const res = await this.businesService.addNewBusinessSnapshot(userId, data);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(["participant", 'admin'])
  @Get('summary') 
  async getBusinessSummary(
    @Param('userId') userId: string
  ) {
    const res = await this.businesService.getBusinessDevelopments(userId);
    return Utils.ResponseSuccess('success', res);
  }
}

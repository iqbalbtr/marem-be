import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@guards/auth.guard';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { Role } from '@decorators/role.decorator';
import { LearningStatisticService } from './services/learning-statistic.service';

@Role(['admin', 'participant'])
@UseGuards(AuthGuard)
@Controller('/api/learnings') 
export class LearningController {

  constructor(
    private readonly learningStatisticService: LearningStatisticService,
  ) { }


  @Get('statistics')
  async getLearningStats(@User() user: UserToken) {
    const res = await this.learningStatisticService.getStatsForUser(user.user_id);
    return Utils.ResponseSuccess('success', res);
  }

}
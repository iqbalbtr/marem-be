import { Controller, Get, Param, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Utils } from '@utils/index';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Role } from '@decorators/role.decorator';
import { LearningCoachingService } from '../services/learning-coaching.service';
import { CoachingPresenceService } from '../../core/coaching/services/coaching-presence.service';
import { AuthGuard } from '@guards/auth.guard';
import { CoachingService } from '../../core/coaching/services/coaching.service';

@UseGuards(AuthGuard)
@Role(['admin', 'participant'])
@Controller('/api/learning/coachings')
export class LearningCoachingController {
  constructor(
    private readonly learningCoachingService: LearningCoachingService,
    private readonly coachingPresenceService: CoachingPresenceService,
    private readonly coachingService: CoachingService,
  ) { }

  @Get()
  async getAllCoachings(
    @User() user: UserToken,
    @Query() query: PaginationDto,
  ) {
    const coachings = await this.learningCoachingService.getAllCoachingSessions(query, user);
    return Utils.ResponseSuccess('success', coachings);
  }


  @Get('/:coachingId')
  async getCoachingDetail(
    @Param('coachingId') coachingId: string,
  ) {
    const res = await this.coachingService.getSessionCoachingById(coachingId);
    return Utils.ResponseSuccess('success', res);
  }
  
  @Get('/:coachingId/presences')
  async getCoachingPresences(
    @Param('coachingId') coachingId: string,
    @Query() query: PaginationDto,
  ) {
    const res = await this.coachingPresenceService.getCoachingPresence(coachingId, query);
    return Utils.ResponseSuccess('success', res);
  }

  @Redirect()
  @Post('/:coachingId/join')
  async joinCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingPresenceService.joinCoachingSession(coachingId, user.user_id);
    return Utils.ResponseRedirect(res.link, 'Redirecting to coaching session', res.platform);
  }
}

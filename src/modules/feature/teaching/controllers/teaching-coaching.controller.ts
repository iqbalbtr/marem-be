import { User } from '@decorators/auth.decorator';
import { Role } from '@decorators/role.decorator';
import { UserToken } from '@models/token.model';
import { Body, Controller, Get, Param, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { Utils } from '@utils/index';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CoachingLifecycleService } from '../../core/coaching/services/coaching-lifecycle.service';
import { CoachingPresenceService } from '../../core/coaching/services/coaching-presence.service';
import { MarkPresenceDto } from '../../core/coaching/dto/mark-presence.dto';
import { AuthGuard } from '@guards/auth.guard';
import { CoachingService } from '../../core/coaching/services/coaching.service';

@UseGuards(AuthGuard)
@Role(['admin', 'asesor'])
@Controller('/api/teaching/coachings')
export class TeachingCoachingController {

  constructor(
    private readonly coachingLifecycleService: CoachingLifecycleService,
    private readonly coachingService: CoachingService,
    private readonly coachingPresenceService: CoachingPresenceService,
  ) { }

  @Get()
  async getAllCoachings(
    @User() user: UserToken,
    @Query() query: PaginationDto,
  ) {
    const coachings = await this.coachingService.getAllCoachingSessions(query, user.user_id);
    return Utils.ResponseSuccess('success', coachings);
  }

  @Get('/:coachingId/presences')
  async getCoachingPresences(
    @Param('coachingId') coachingId: string,
    @Query() query: PaginationDto,
  ) {
    const res = await this.coachingPresenceService.getCoachingPresence(coachingId, query);
    return Utils.ResponseSuccess('success', res.data, res.pagination);
  }

  @Post('/:coachingId/presences')
  async markCoachingPresence(
    @Param('coachingId') coachingId: string,
    @Body() body: MarkPresenceDto,
  ) {
    const res = await this.coachingPresenceService.markPresence(coachingId, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Redirect()
  @Post('/:coachingId/start')
  async startCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingLifecycleService.startCoachingSession(user, coachingId);
    return Utils.ResponseRedirect(res.url, 'Redirecting to coaching session', res.platform);
  }

  @Post('/:coachingId/end')
  async endCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingLifecycleService.endCoachingSession(user, coachingId);
    return Utils.ResponseSuccess('success', res);
  }

}

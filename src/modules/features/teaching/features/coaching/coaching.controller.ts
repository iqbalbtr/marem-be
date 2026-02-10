import { User } from '@decorators/auth.decorator';
import { Role } from '@decorators/role.decorator';
import { UserToken } from '@models/token.model';
import { Body, Controller, Get, Param, Post, Query, Redirect } from '@nestjs/common';
import { Utils } from '@utils/index';
import { CoachingPresenceService } from '../../coaching/services/coaching-presence.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CoachingService } from './coaching.service';
import { CoachingLifecycleService } from '../../coaching/services/coaching-lifecycle.service';
import { MarkPresenceDto } from './dto/mark-presence.dto';

@Role(['admin', 'mentor', 'asesor'])
@Controller('/api/teaching/coachings')
export class CoachingController {

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
    const coachings = await this.coachingService.getAllCoachingSessions(query, user);
    return Utils.ResponseSuccess('success', coachings);
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

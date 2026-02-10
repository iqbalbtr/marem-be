import { Controller, Get, Param, Post, Query, Redirect } from '@nestjs/common';
import { CoachingService } from './coaching.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Utils } from '@utils/index';
import { CoachingPresenceService } from '../../coaching/services/coaching-presence.service';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Role } from '@decorators/role.decorator';

@Role(['admin', 'participant'])
@Controller('/api/learning/coachings')
export class CoachingController {
  constructor(
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

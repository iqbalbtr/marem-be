import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { CoachingService } from './coaching.service';
import { CoachingPresenceService } from './coaching-presence.service';
import { CoachingLivecycleService } from './coaching-livecycle.service';
import { AuthGuard } from '@guards/auth.guard';
import { QueryCoachingDto } from './dto/query-coaching.dto';
import { Utils } from '@utils/index';
import { CreateCoachingDto } from './dto/create-coaching.dto';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Role } from '@decorators/role.decorator';
import { PaginationDto } from 'src/shared/pagination-dto';
import { MarkPresenceDto } from './dto/mark-presence.dto';

@UseGuards(AuthGuard)
@Controller('/api/coachings')
export class CoachingController {

  constructor(
    private readonly coachingService: CoachingService,
    private readonly coachingPresenceService: CoachingPresenceService,
    private readonly coachingLivecycleService: CoachingLivecycleService,
  ) { }

  @Get()
  async getAllCoachings(
    @Query() query: QueryCoachingDto,
  ) {
    const coachings = await this.coachingService.getAllCoachingSessions(query);
    return Utils.ResponseSuccess('success', coachings);
  }

  @Role('admin')
  @Post()
  async createCoachingSession(
    @Body() body: CreateCoachingDto,
  ) {
    const res = await this.coachingService.createSessionCoaching(body)
    return Utils.ResponseSuccess('Coaching session created successfully', res);
  }

  @Role(['admin', 'mentor'])
  @Patch('/:coachingId')
  async updateCoachingSession(
    @Body() body: CreateCoachingDto,
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingService.updateSessionCoaching(user, coachingId, body)
    return Utils.ResponseSuccess('success', res);
  }

  @Get('/:coachingId')
  async getCoachingDetails(
    @Param('coachingId') coachingId: string,
  ) {
    const res = await this.coachingService.getSessionCoachingById(coachingId);
    return Utils.ResponseSuccess('success', res);
  }

  @Role('admin')
  @Delete('/:coachingId')
  async deleteCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingService.deleteSessionCoaching(user, coachingId);
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

  @Post('/:coachingId/presences')
  async markCoachingPresence(
    @Param('coachingId') coachingId: string,
    @Body() body: MarkPresenceDto,
  ) {
    const res = await this.coachingPresenceService.markPresence(coachingId, body);
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

  @Role(['admin', 'mentor'])
  @Redirect()
  @Post('/:coachingId/start')
  async startCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingLivecycleService.startCoachingSession(user, coachingId);
    return Utils.ResponseRedirect(res.url, 'Redirecting to coaching session', res.platform);
  }

  @Role(['admin', 'mentor'])
  @Post('/:coachingId/end')
  async endCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingLivecycleService.endCoachingSession(user, coachingId);
    return Utils.ResponseSuccess('success', res);
  }

}

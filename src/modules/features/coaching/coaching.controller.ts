import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { CoachingService } from '../services/coaching.service';
import { AuthGuard } from '@guards/auth.guard';
import { QueryCoachingDto } from '../dto/query-coaching.dto';
import { Utils } from '@utils/index';
import { CreateCoachingDto } from '../dto/create-coaching.dto';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Role } from '@decorators/role.decorator';

@UseGuards(AuthGuard)
@Role('admin')
@Controller('/api/coachings')
export class CoachingController {

  constructor(
    private readonly coachingService: CoachingService,
  ) { }

  @Get()
  async getAllCoachings(
    @Query() query: QueryCoachingDto,
  ) {
    const coachings = await this.coachingService.getAllCoachingSessions(query);
    return Utils.ResponseSuccess('success', coachings);
  }

  @Post()
  async createCoachingSession(
    @Body() body: CreateCoachingDto,
  ) {
    const res = await this.coachingService.createSessionCoaching(body)
    return Utils.ResponseSuccess('Coaching session created successfully', res);
  }

  @Patch('/:coachingId')
  async updateCoachingSession(
    @Body() body: CreateCoachingDto,
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingService.updateSessionCoaching(user, coachingId, body)
    return Utils.ResponseSuccess('success', res);
  }

  @Delete('/:coachingId')
  async deleteCoachingSession(
    @Param('coachingId') coachingId: string,
    @User() user: UserToken,
  ) {
    const res = await this.coachingService.deleteSessionCoaching(user, coachingId);
    return Utils.ResponseSuccess('success', res);
  }

}

import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@guards/auth.guard';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { Role } from '@decorators/role.decorator';
import { QueryCourseDto } from '../dto/query-course.dto';
import { LearningCourseService } from '../services/learning-course.service';


@Role('participant')
@UseGuards(AuthGuard)
@Controller('/api/learnings') 
export class LearningCourseController {

  constructor(
    private readonly learningCourseService: LearningCourseService,
  ) { }

  @Get()
  async getLearnings(
    @User() user: UserToken,
    @Query() query: QueryCourseDto
  ) {
    const res = await this.learningCourseService.getCourses(user, query);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':learningId/modules')
  async getLearningModules(
    @User() user: UserToken,
    @Param('learningId') learningId: string
  ) {
    const res = await this.learningCourseService.getCourseModule(user, learningId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':learningId/modules/:moduleId/materials')
  async getMaterialItems(
    @User() user: UserToken,
    @Param('moduleId') moduleId: string,
  ) {
    const res = await this.learningCourseService.getCourseModuleItems(user, moduleId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':learningId/modules/:moduleId/materials/:itemId')
  async getMaterialContent(
    @User() user: UserToken,
    @Param('itemId') itemId: string,
  ) {
    const res = await this.learningCourseService.getMaterialContent(user, itemId);
    return Utils.ResponseSuccess('success', res);
  }

  @Post(':learningId/modules/:moduleId/materials/:itemId/complete')
  async markMaterialAsCompleted(
    @User() user: UserToken,
    @Param('learningId') learningId: string,
    @Param('itemId') itemId: string,
  ) {
    const res = await this.learningCourseService.markMaterialAsCompleted(user.user_id, learningId, itemId);
    return Utils.ResponseSuccess('Material marked as completed', res);
  }
}
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LearningService } from './learning.service';
import { AuthGuard } from '@guards/auth.guard';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { QueryLearningDto } from './dto/query-learning.dto';
import { Utils } from '@utils/index';
import { Role } from '@decorators/role.decorator';
import { LearningStatisticService } from './services/learning-statistic.service';
import { GradingService } from './grading/grading.service';
import { GradeMentorDto, GradingDto } from './dto/grading.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@UseGuards(AuthGuard)
@Controller('/api/learnings') 
export class LearningController {

  constructor(
    private readonly learningService: LearningService,
    private readonly learningStatisticService: LearningStatisticService,
    private readonly gradingService: GradingService,
  ) { }


  @Get('statistics')
  @Role('participant')
  async getLearningStats(@User() user: UserToken) {
    const res = await this.learningStatisticService.getStatsForUser(user.user_id);
    return Utils.ResponseSuccess('success', res);
  }

  @Get()
  @Role('participant')
  async getLearnings(
    @User() user: UserToken,
    @Query() query: QueryLearningDto
  ) {
    const res = await this.learningService.getLearnings(user, query);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':learningId/modules')
  @Role('participant')
  async getLearningModules(
    @User() user: UserToken,
    @Param('learningId') learningId: string
  ) {
    const res = await this.learningService.getLearningModule(user, learningId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':learningId/modules/:moduleId/materials')
  @Role('participant')
  async getMaterialItems(
    @User() user: UserToken,
    @Param('learningId') learningId: string,
    @Param('moduleId') moduleId: string,
  ) {
    const res = await this.learningService.getLearningModuleItems(user, learningId, moduleId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':learningId/modules/:moduleId/materials/:itemId')
  @Role('participant')
  async getMaterialContent(
    @User() user: UserToken,
    @Param('itemId') itemId: string,
  ) {
    const res = await this.learningService.getMaterialContent(user, itemId);
    return Utils.ResponseSuccess('success', res);
  }

  @Post(':learningId/modules/:moduleId/materials/:itemId/complete')
  @Role('participant')
  async markMaterialAsCompleted(
    @User() user: UserToken,
    @Param('learningId') learningId: string,
    @Param('itemId') itemId: string,
  ) {
    const res = await this.learningService.markMaterialAsCompleted(user.user_id, learningId, itemId);
    return Utils.ResponseSuccess('Material marked as completed', res);
  }


  @Post(':learningId/modules/:moduleId/materials/:itemId/submit')
  @Role('participant')
  async submitAssignment(
    @Param('itemId') itemId: string,
    @User() user: UserToken,
    @Body() dto: GradingDto
  ) {
    const res = await this.gradingService.submitByStudent(itemId, user, dto);
    return Utils.ResponseSuccess('Submission successful', res);
  }

 
  @Get(':learningId/modules/:moduleId/materials/:itemId/submissions')
  @Role(['admin', 'asesor'])
  async getSubmissions(
    @Param('itemId') itemId: string,
    @User() user: UserToken,
    @Query() query: PaginationDto
  ) {
    const res = await this.gradingService.getSubmissionsByItem(user, itemId, query);
    return Utils.ResponseSuccess('success', res);
  }


  @Get('submissions/:submissionId')
  @Role(['admin', 'asesor']) 
  async getSubmissionDetails(
    @Param('submissionId') submissionId: string,
  ) {
    const res = await this.gradingService.getSubmissionDetails(submissionId);
    return Utils.ResponseSuccess('success', res);
  }

  @Patch('submissions/:submissionId/grade')
  @Role(['admin', 'asesor'])
  async gradeSubmission(
    @Param('submissionId') submissionId: string,
    @User() user: UserToken,
    @Body() dto: GradeMentorDto
  ) {
    const res = await this.gradingService.gradeByMentor(submissionId, user, dto);
    return Utils.ResponseSuccess('Grading successful', res);
  }
}
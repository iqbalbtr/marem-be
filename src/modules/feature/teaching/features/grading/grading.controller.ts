import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { GradingService } from './grading.service';
import { Role } from '@decorators/role.decorator';
import { GradeMentorDto } from './dto/grade-mentor.dto';
import { UserToken } from '@models/token.model';
import { User } from '@decorators/auth.decorator';
import { Utils } from '@utils/index';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { QueryGradeDto } from './dto/query-grade.dto';

@Role(['admin', 'asesor'])
@Controller('/api/teaching/submissions')
export class GradingController {

  constructor(private readonly gradingService: GradingService) { }

  @Get('')
  async getSubmissions(
    @User() user: UserToken,
    @Query() query: QueryGradeDto
  ) {
    const res = await this.gradingService.getSubmissionsByItem(user, query);
    return Utils.ResponseSuccess('success', res.data, res.pagination);
  }

  @Patch(':submissionId/grade')
  async gradeSubmission(
    @Param('submissionId') submissionId: string,
    @User() user: UserToken,
    @Body() dto: GradeMentorDto
  ) {
    const res = await this.gradingService.gradeByMentor(submissionId, user, dto);
    return Utils.ResponseSuccess('Grading successful', res);
  }

  @Get(':submissionId')
  async getSubmissionDetails(
    @Param('submissionId') submissionId: string,
  ) {
    const res = await this.gradingService.getSubmissionDetails(submissionId);
    return Utils.ResponseSuccess('success', res);
  }
}

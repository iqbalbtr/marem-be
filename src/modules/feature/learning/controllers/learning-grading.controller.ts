import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@decorators/role.decorator';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { LearningGradingService } from '../services/learning-grading.service';
import { GradingDto } from '../dto/grading.dto';
import { AuthGuard } from '@guards/auth.guard';
import { QueryGradeDto } from '../../teaching/dto/query-grade.dto';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@UseGuards(AuthGuard)
@Role(['admin', 'participant'])
@Controller('/api/learning/submissions')
export class LearningGradingController {

    constructor(
        private readonly gradingService: LearningGradingService,
    ) { }

    @Get()
    async getAllSubmissions(
        @User() user: UserToken,
        @Query() query: QueryGradeDto
    ) {
        const res = await this.gradingService.getAllSubmissions(user, query);
        return Utils.ResponseSuccess('success', res.data, res.pagination);
    }
  
    @Get('/courses')
    async getAllSubmissionsCourses(
        @User() user: UserToken,
        @Query() query: PaginationDto
    ) {
        const res = await this.gradingService.getAllSubmissionsCourses(user, query);
        return Utils.ResponseSuccess('success', res.data, res.pagination);
    }

    @Get('/statistics')
    async getStatistics(
        @User() user: UserToken,
    ) {
        const res = await this.gradingService.getStaticaticsForCourse(user);
        return Utils.ResponseSuccess('success', res);
    }

    @Post('/materials/:itemId/submit')
    async submitAssignment(
        @Param('itemId') itemId: string,
        @User() user: UserToken,
        @Body() dto: GradingDto
    ) {
        const res = await this.gradingService.submitByStudent(itemId, user, dto);
        return Utils.ResponseSuccess('Submission successful', res);
    }

    @Get(':submissionId')
    async getSubmissionDetails(
        @Param('submissionId') submissionId: string,
    ) {
        const res = await this.gradingService.getSubmissionDetails(submissionId);
        return Utils.ResponseSuccess('success', res);
    }
}

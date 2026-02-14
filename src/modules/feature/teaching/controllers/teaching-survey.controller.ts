import { Role } from '@decorators/role.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SurveyService } from '../../core/survey/services/survey.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { SurveySubmissionService } from '../../core/survey/services/survey-submission.service';
import { SubmitSurveyDto } from '../../core/survey/dto/submit-survey.dto';

@UseGuards(AuthGuard)
@Role(['admin', 'mentor', 'asesor'])
@Controller('/api/teaching/surveys')
export class TeachingSurveyController {

    constructor(
        private readonly surveyService: SurveyService,
        private readonly surveySubmissionService: SurveySubmissionService,
    ) { }

    @Get()
    async getListSurvey(
        @Query() query: PaginationDto,
        @User() user: UserToken
    ) {
        const res = await this.surveyService.getListSurveys({ ...query, target_role: user.role }, {
            reponseIndicator: true,
            user_id: user.user_id,
            statusAllowed: ['published', 'archived', 'closed']
        })
        return Utils.ResponseSuccess('success', res.data, res.pagination)
    }

    @Get(':surveyId')
    async getSurveyDetails(
        @Param('surveyId') surveyId: string,
        @User() user: UserToken,
    ) {
        const res = await this.surveySubmissionService.getSubmissionById(surveyId, user);
        return Utils.ResponseSuccess('success', res)
    }

    @Post(':surveyId/submit')
    async submitSurvey(
        @Param('surveyId') surveyId: string,
        @User() user: UserToken,
        @Body() dto: SubmitSurveyDto,
    ) {
        const res = await this.surveySubmissionService.submitSurvey(surveyId, user, dto);
        return Utils.ResponseSuccess('Survey submitted successfully', res)
    }

}

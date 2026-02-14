import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SurveyService } from './services/survey.service';
import { QuerySurveyDto } from './dto/query-survey.dto';
import { Utils } from '@utils/index';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';
import { SurveyStatisticService } from './services/survey-statistic.service';

@UseGuards(AuthGuard)
@Role('admin')
@Controller('/api/surveys')
export class SurveyController {

  constructor(
    private readonly surveyService: SurveyService,
    private readonly surveyStatisticService: SurveyStatisticService
  ) { }

  @Get()
  async getSurveys(
    @Query() query: QuerySurveyDto
  ) {
    const res = await this.surveyService.getListSurveys(query);
    return Utils.ResponseSuccess('success', res.data, res.pagination);
  }

  @Get(':surveyId')
  async getSurveyDetails(
    @Param('surveyId') surveyId: string
  ) {
    const res = await this.surveyService.getSurveyById(surveyId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':surveyId/statistic')
  async getStatistic(
    @Param('surveyId') surveyId: string
  ) {
    const res = await this.surveyStatisticService.getStatisticSubmission(surveyId);
    return Utils.ResponseSuccess('success', res);
  }

  @Post()
  async createSurvey(
    @Body() surveyData: CreateSurveyDto
  ) {
    const res = await this.surveyService.createSurvey(surveyData);
    return Utils.ResponseSuccess('success', res);
  }

  @Patch(':surveyId')
  async updateSurvey(
    @Param('surveyId') surveyId: string,
    @Body() surveyData: CreateSurveyDto
  ) {
    const res = await this.surveyService.updateSurvey(surveyId, surveyData);
    return Utils.ResponseSuccess('success', res);
  }

  @Delete(':surveyId')
  async deleteSurvey(
    @Param('surveyId') surveyId: string,
  ) {
    const res = await this.surveyService.deleteSurvey(surveyId);
    return Utils.ResponseSuccess('success', res);
  }
}

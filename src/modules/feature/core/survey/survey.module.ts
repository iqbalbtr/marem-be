import { Module } from '@nestjs/common';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './survey.controller';
import { SurveySubmissionService } from './services/survey-submission.service';
import { SurveyStatisticService } from './services/survey-statistic.service';

@Module({
  controllers: [SurveyController],
  providers: [
    SurveyService,
    SurveySubmissionService,
    SurveyStatisticService
  ],
  exports: [
    SurveyService,
    SurveySubmissionService,
    SurveyStatisticService
  ],
})
export class SurveyModule { }

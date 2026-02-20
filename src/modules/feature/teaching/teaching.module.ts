import { Module } from '@nestjs/common';
import { TeachingAccessService } from './services/teaching-access.service';
import { CoachingModule } from '../core/coaching/coaching.module';
import { CourseModule } from '../core/course/course.module';
import { TeachingGradingController } from './controllers/teaching-grading.controller';
import { TeachingCourseController } from './controllers/teaching-course.controller';
import { TeachingGradingService } from './services/teaching-grading.service';
import { TeachingSurveyController } from './controllers/teaching-survey.controller';
import { SurveyModule } from '../core/survey/survey.module';
import { UserModule } from '../core/user/user.module';
import { BussinesModule } from '../core/bussines/bussines.module';
import { TeachingCoachingController } from './controllers/teaching-coaching.controller';
import { TeachingStudentController } from './controllers/teaching-student.controller';

@Module({
  imports: [
    CoachingModule,
    CourseModule,
    SurveyModule,
    UserModule,
    BussinesModule
  ],
  controllers: [
    TeachingGradingController,
    TeachingCourseController,
    TeachingCoachingController,
    TeachingSurveyController,
    TeachingStudentController,
  ],
  providers: [
    TeachingAccessService,
    TeachingGradingService,
  ],
})
export class TeachingModule { }

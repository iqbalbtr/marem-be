import { Module } from '@nestjs/common';
import { TeachingAccessService } from './services/teaching-access.service';
import { CoachingModule } from '../core/coaching/coaching.module';
import { CourseModule } from '../core/course/course.module';
import { TeachingGradingController } from './controllers/teaching-grading.controller';
import { TeachingCourseController } from './controllers/teaching-course.controller';
import { TeachingGradingService } from './services/teaching-grading.service';
import { TeachingCoachingService } from './services/teaching-coaching.service';
import { TeachingCourseService } from './services/teaching-course.service';

@Module({
  imports: [
    CoachingModule,
    CourseModule
  ],
  controllers: [
    TeachingGradingController,
    TeachingCourseController,
    TeachingCourseController
  ],
  providers: [
    TeachingAccessService,
    TeachingGradingService,
    TeachingCoachingService,
    TeachingCourseService
  ],
})
export class TeachingModule { }

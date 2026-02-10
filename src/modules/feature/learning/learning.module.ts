import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller';
import { LearningStatisticService } from './services/learning-statistic.service';
import { CourseModule } from './features/course/course.module';
import { GradingModule } from './features/grading/grading.module';
import { CoachingModule } from './features/coaching/coaching.module';

@Module({
  controllers: [LearningController],
  providers: [
    LearningStatisticService,
  ],
  imports: [
    CourseModule,
    GradingModule,
    CoachingModule
  ],
})
export class LearningModule {}

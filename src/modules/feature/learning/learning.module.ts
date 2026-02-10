import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller';
import { LearningStatisticService } from './services/learning-statistic.service';
import { LearningCoachingController } from './controllers/learning-coaching.controller';
import { LearningGradingController } from './controllers/learning-grading.controller';
import { LearningCoachingService } from './services/learning-coaching.service';
import { LearningCourseService } from './services/learning-course.service';
import { LearningCourseAccessService } from './services/learning-course-access.service';
import { LearningCourseProgressService } from './services/learning-course-progress.service';
import { LearningGradingService } from './services/learning-grading.service';
import { GradingOrchestrator } from './grading/grading.orchestrator';
import { AssignmentGradingStrategy } from './grading/strategies/assignment-grading.strategy';
import { QuizGradingStrategy } from './grading/strategies/quiz-grading.strategy';
import { CoachingModule } from '../core/coaching/coaching.module';

@Module({
  controllers: [
    LearningController,
    LearningCoachingController,
    LearningGradingController
  ],
  providers: [
    LearningStatisticService,
    LearningCoachingService,
    
    LearningCourseService,
    LearningCourseAccessService,
    LearningCourseProgressService,

    LearningGradingService,
    
    GradingOrchestrator,
    AssignmentGradingStrategy,
    QuizGradingStrategy
  ],
  imports: [
    CoachingModule
  ],
})
export class LearningModule {}

import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { LearningAccessService } from './services/learning-access.service';
import { LearningProgressService } from './services/learning-progress.service';
import { LearningStatisticService } from './services/learning-statistic.service';
import { GradingOrchestrator } from './grading/grading.orchestrator';
import { AssignmentGradingStrategy } from './grading/strategies/assignment-grading.strategy';
import { QuizGradingStrategy } from './grading/strategies/quiz-grading.strategy';

@Module({
  controllers: [LearningController],
  providers: [
    LearningService,
    LearningAccessService,
    LearningProgressService,
    LearningStatisticService,

    GradingOrchestrator,
    AssignmentGradingStrategy,
    QuizGradingStrategy
  ],
})
export class LearningModule {}

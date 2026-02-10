import { Module } from '@nestjs/common';
import { GradingController } from './grading.controller';
import { GradingService } from './grading.service';
import { GradingOrchestrator } from './grading.orchestrator';
import { QuizGradingStrategy } from './strategies/quiz-grading.strategy';
import { AssignmentGradingStrategy } from './strategies/assignment-grading.strategy';
import { LearningAccessService } from '../services/learning-access.service';

@Module({
  controllers: [GradingController],
  providers: [
    LearningAccessService,
    GradingService,

    GradingOrchestrator,
    AssignmentGradingStrategy,
    QuizGradingStrategy
  ],
})
export class GradingModule {}

import { Module } from '@nestjs/common';
import { GradingController } from './grading.controller';
import { GradingService } from './grading.service';
import { GradingOrchestrator } from './grading.orchestrator';
import { QuizGradingStrategy } from './strategies/quiz-grading.strategy';
import { AssignmentGradingStrategy } from './strategies/assignment-grading.strategy';
import { CourseModule } from '../course/course.module';

@Module({
  controllers: [GradingController],
  providers: [
    GradingService,

    GradingOrchestrator,
    AssignmentGradingStrategy,
    QuizGradingStrategy
  ],
  imports: [CourseModule],
})
export class GradingModule {}

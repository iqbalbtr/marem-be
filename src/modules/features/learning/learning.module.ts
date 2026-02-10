import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { LearningAccessService } from './services/learning-access.service';
import { LearningProgressService } from './services/learning-progress.service';
import { LearningStatisticService } from './services/learning-statistic.service';
import { GradingModule } from './grading/grading.module';
import { CoachingModule } from './coaching/coaching.module';

@Module({
  controllers: [LearningController],
  providers: [
    LearningService,
    LearningAccessService,
    LearningProgressService,
    LearningStatisticService,
  ],
  imports: [GradingModule, CoachingModule],
})
export class LearningModule {}

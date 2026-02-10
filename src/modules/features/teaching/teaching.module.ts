import { Module } from '@nestjs/common';
import { GradingModule } from './grading/grading.module';
import { CoachingModule } from './coaching/coaching.module';

@Module({
  imports: [GradingModule, CoachingModule]
})
export class TeachingModule {}

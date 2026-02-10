import { Module } from '@nestjs/common';
import { CourseModule } from './features/course/course.module';
import { CoachingModule } from './features/coaching/coaching.module';
import { GradingModule } from './features/grading/grading.module';
import { TeachingAccessService } from './services/teaching-access.service';

@Module({
  imports: [GradingModule, CoachingModule, CourseModule],
  providers: [TeachingAccessService],
  exports: [TeachingAccessService],
})
export class TeachingModule {}

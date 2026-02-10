import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseAccessService } from './services/course-access.service';
import { CourseProgressService } from './services/course-progress.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseAccessService, CourseProgressService],
  exports: [CourseAccessService, CourseProgressService],
})
export class CourseModule { }

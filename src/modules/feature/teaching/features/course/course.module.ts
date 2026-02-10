import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseModule as BaseCourseModule } from 'src/modules/feature/course/course.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [BaseCourseModule],
})
export class CourseModule {}

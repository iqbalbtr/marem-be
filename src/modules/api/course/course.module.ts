import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { ModuleService } from './module.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, ModuleService],
})
export class CourseModule {}

import { Module } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { CourseController } from './course.controller';
import { ModuleService } from './services/module.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, ModuleService],
})
export class CourseModule {}

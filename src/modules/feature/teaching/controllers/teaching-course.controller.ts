import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CreateCourseDto } from '../../core/course/dto/create-course.dto';
import { TeachingCourseService } from '../services/teaching-course.service';
import { CourseService } from '../../core/course/services/course.service';

@Controller('/api/teaching/courses')
export class TeachingCourseController {

  constructor(
    private readonly teachingCourseService: TeachingCourseService,
    private readonly CourseService: CourseService,
  ) { }

  @Get()
  async getLearnings(
    @User() user: UserToken,
    @Query() query: PaginationDto
  ) {
    const res = await this.teachingCourseService.getCourses(user, query);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId/modules')
  async getLearningModules(
    @User() user: UserToken,
    @Param('courseId') courseId: string
  ) {
    const res = await this.teachingCourseService.getCourseModule(user, courseId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId/modules/:moduleId/materials')
  async getMaterialItems(
    @User() user: UserToken,
    @Param('moduleId') moduleId: string,
    @Param('courseId') courseId: string
  ) {
    const res = await this.teachingCourseService.getCourseModuleItems(user, courseId, moduleId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId/modules/:moduleId/materials/:itemId')
  async getMaterialContent(
    @User() user: UserToken,
    @Param('itemId') itemId: string,
    @Param('courseId') courseId: string
  ) {
    const res = await this.teachingCourseService.getMaterialContent(user, courseId, itemId);
    return Utils.ResponseSuccess('success', res);
  }


  @Patch(":courseId")
  async updateCourse(
    @Body() body: CreateCourseDto,
    @Param("courseId") courseId: string,
  ) {
    const res = await this.CourseService.updateCourse(courseId, body);
    return Utils.ResponseSuccess('success', res);
  }

}

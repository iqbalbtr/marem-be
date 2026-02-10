import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CourseService as BaseCourseService } from 'src/modules/feature/course/services/course.service';
import { CreateCourseDto } from 'src/modules/feature/course/dto/create-course.dto';

@Controller('/api/teaching/courses')
export class CourseController {

  constructor(
    private readonly courseService: CourseService,
    private readonly baseCourseService: BaseCourseService,
  ) { }

  @Get()
  async getLearnings(
    @User() user: UserToken,
    @Query() query: PaginationDto
  ) {
    const res = await this.courseService.getCourses(user, query);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId/modules')
  async getLearningModules(
    @User() user: UserToken,
    @Param('courseId') courseId: string
  ) {
    const res = await this.courseService.getCourseModule(user, courseId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId/modules/:moduleId/materials')
  async getMaterialItems(
    @User() user: UserToken,
    @Param('moduleId') moduleId: string,
    @Param('courseId') courseId: string
  ) {
    const res = await this.courseService.getCourseModuleItems(user, courseId, moduleId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId/modules/:moduleId/materials/:itemId')
  async getMaterialContent(
    @User() user: UserToken,
    @Param('itemId') itemId: string,
    @Param('courseId') courseId: string
  ) {
    const res = await this.courseService.getMaterialContent(user, courseId, itemId);
    return Utils.ResponseSuccess('success', res);
  }


  @Patch(":courseId")
  async updateCourse(
    @Body() body: CreateCourseDto,
    @Param("courseId") courseId: string,
  ) {
    const res = await this.baseCourseService.updateCourse(courseId, body);
    return Utils.ResponseSuccess('success', res);
  }

}

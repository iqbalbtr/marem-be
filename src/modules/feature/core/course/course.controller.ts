import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { ModuleService } from './services/module.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Utils } from '@utils/index';
import { QueryCourseDto } from './dto/query-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';

@Role('admin')
@UseGuards(AuthGuard)
@Controller('/api/courses')
export class CourseController {

  constructor(
    private readonly courseService: CourseService,
    private readonly moduleService: ModuleService
  ) { }

  @Post()
  async createCourse(
    @Body() body: CreateCourseDto
  ) {
    const res = await this.courseService.createCourse(body);
    return Utils.ResponseSuccess('success', res);
  }

  @Get()
  async getAllCourses(
    @Query() query: QueryCourseDto
  ) {
    const { data, pagination } = await this.courseService.getAllCourses(query);
    return Utils.ResponseSuccess('success', data, pagination);
  }

  @Get(':courseId')
  async getLearningDetail(
    @Param('courseId') courseId: string
  ) {
    const res = await this.courseService.getCourseDetail(courseId);
    return Utils.ResponseSuccess('success', res);
  }

  @Patch(":id")
  async updateCourse(
    @Body() body: CreateCourseDto,
    @Param("id") id: string,
  ) {
    const res = await this.courseService.updateCourse(id, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Delete(":id")
  async deleteCourse(
    @Param("id") id: string,
  ) {
    const res = await this.courseService.deleteCourse(id);
    return Utils.ResponseSuccess('success', res);
  }

  @Patch(":id/modules")
  async updateCourseModules(
    @Param("id") courseId: string,
    @Body() body: CreateModuleDto,
  ) {
    const res = await this.moduleService.createModule(courseId, body);
    return Utils.ResponseSuccess('success', res);
  }

}

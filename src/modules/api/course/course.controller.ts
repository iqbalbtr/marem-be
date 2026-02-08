import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './services/course.service';
import { ModuleService } from './services/module.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Utils } from '@utils/index';
import { QueryCourseDto } from './dto/query-course.dtp';
import { CreateModuleDto } from './dto/create-module.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';
import { CheckOwnership } from '@decorators/check-ownership.decorator';

@UseGuards(AuthGuard)
@Controller('/api/courses')
export class CourseController {

  constructor(
    private readonly courseService: CourseService,
    private readonly moduleService: ModuleService
  ) { }

  @Role("admin")
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

  @Role("admin")
  @Patch(":id")
  async updateCourse(
    @Body() body: CreateCourseDto,
    @Param("id") id: string,
  ) {
    const res = await this.courseService.updateCourse(id, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Role("admin")
  @Delete(":id")
  async deleteCourse(
    @Param("id") id: string,
  ) {
    const res = await this.courseService.deleteCourse(id);
    return Utils.ResponseSuccess('success', res);
  }

  @Role(['admin', 'asesor', 'fasilitator'])
  @Post(":id/modules")
  async updateCourseModules(
    @Param("id") courseId: string,
    @Body() body: CreateModuleDto,
  ) {
    const res = await this.moduleService.createModule(courseId, body);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(":id/modules")
  async getCourseModules(
    @Param("id") courseId: string,
  ) {
    const res = await this.moduleService.getCourseModules(courseId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(":id/modules/:moduleId/items")
  async getCourseModuleItems(
    @Param("id") courseId: string,
    @Param("moduleId") moduleId: string,
  ) {
    const res = await this.moduleService.getModuleItems(courseId, moduleId);
    return Utils.ResponseSuccess('success', res);
  }

  @Get(":id/modules/:moduleId/items/:itemId")
  async getCourseModuleItemById(
    @Param("id") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("itemId") itemId: string,
  ) {
    const res = await this.moduleService.getModuleItemById(courseId, itemId, moduleId);
    return Utils.ResponseSuccess('success', res);
  }
}

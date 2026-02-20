import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CourseService } from '../../core/course/services/course.service';
import { ModuleService } from '../../core/course/services/module.service';
import { CreateModuleDto } from '../../core/course/dto/create-module.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Role } from '@decorators/role.decorator';

@Role(['asesor', 'admin'])
@UseGuards(AuthGuard)
@Controller('/api/teaching/courses')
export class TeachingCourseController {

  constructor(
    private readonly courseService: CourseService,
    private readonly courseModuleService: ModuleService,
  ) { }

  @Get()
  async getLearnings(
    @User() user: UserToken,
    @Query() query: PaginationDto
  ) {
    const res = await this.courseService.getAllCourses(query, {
      whereClause: {
        asesor_id: user.user_id
      }
    });
    return Utils.ResponseSuccess('success', res);
  }

  @Get(':courseId')
  async getLearningDetail(
    @User() user: UserToken,
    @Param('courseId') courseId: string
  ) {
    const res = await this.courseService.getCourseDetail(courseId, {
      asesor_id: user.user_id
    });
    return Utils.ResponseSuccess('success', res);
  }

  @Patch(":courseId/modules")
  async updateCourse(
    @Body() body: CreateModuleDto,
    @Param("courseId") courseId: string,
  ) {
    const res = await this.courseModuleService.createModule(courseId, body);
    return Utils.ResponseSuccess('success', res);
  }

}

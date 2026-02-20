import { Role } from '@decorators/role.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../../core/user/services/user.service';
import { UserReportService } from '../../core/user/services/user-report.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { BusinessService } from '../../core/bussines/bussines.service';

@UseGuards(AuthGuard)
@Role(['admin', 'asesor'])
@Controller('/api/teaching/students')
export class TeachingStudentController {

    constructor(
        private readonly userService: UserService,
        private readonly userReportService: UserReportService,
        private readonly businesService: BusinessService
    ) { }

    @Get()
    async getStudents(
        @Query() query: PaginationDto,
        @User() user: UserToken
    ) {
        const res = await this.userService.findAll({
            ...query,
            asesor_id: user.user_id
        })
        return Utils.ResponseSuccess('success', res.data, res.pagination);
    }

    @Get(':studentId/report')
    async getStudentReports(
        @User() user: UserToken,
        @Param('studentId') studentId: string,
    ) {
        const res = await this.userReportService.getUserReport(studentId, user.user_id)
        return Utils.ResponseSuccess('success', res);
    }

    @Get(':studentId/business/summary')
    async getStudentBusinessReport(
        @User() user: UserToken,
        @Param('studentId') studentId: string,
    ) {
        const res = await this.businesService.getBusinessDevelopments(studentId, user.user_id)
        return Utils.ResponseSuccess('success', res);
    }

    @Get(':studentId')
    async getDetailedStudent(
        @User() user: UserToken,
        @Param('studentId') studentId: string
    ) {
        const { assesor_profile, ...res } = await this.userService.findOne(studentId, {
            participant_profile: {
                asesor_id: user.user_id
            }
        })
        return Utils.ResponseSuccess('success', res);
    }

}


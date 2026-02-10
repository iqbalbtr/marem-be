import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GradingService } from './grading.service';
import { Role } from '@decorators/role.decorator';
import { User } from '@decorators/auth.decorator';
import { UserToken } from '@models/token.model';
import { Utils } from '@utils/index';
import { GradingDto } from './dto/grading.dto';

@Role(['admin', 'participant'])
@Controller('/api/learning/submissions')
export class GradingController {

    constructor(
        private readonly gradingService: GradingService,
    ) { }

    @Post('/materials/:itemId/submit')
    async submitAssignment(
        @Param('itemId') itemId: string,
        @User() user: UserToken,
        @Body() dto: GradingDto
    ) {
        const res = await this.gradingService.submitByStudent(itemId, user, dto);
        return Utils.ResponseSuccess('Submission successful', res);
    }

    @Get(':submissionId')
    async getSubmissionDetails(
        @Param('submissionId') submissionId: string,
    ) {
        const res = await this.gradingService.getSubmissionDetails(submissionId);
        return Utils.ResponseSuccess('success', res);
    }
}

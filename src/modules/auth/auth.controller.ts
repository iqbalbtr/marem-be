import { Body, Controller, Delete, Get, Headers, Ip, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseResponse } from '@models/response.model';
import { LoginValidationDto } from './dto/login-validation.dto';
import { Utils } from '@utils/index';
import { Token, User } from '@decorators/auth.decorator';
import { Throttle } from '@nestjs/throttler';
import throttle from '@config/throttle.config';
import { UserToken } from '@models/token.model';
import { AuthGuard } from '@guards/auth.guard';
import { IncomingHttpHeaders } from 'http';

@Throttle({ default: throttle().throttle.auth })
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @Post('login')
    async login(
        @Body() body: LoginValidationDto,
    ): Promise<BaseResponse<any>> {
        const data = await this.authService.loginUser(body.email, body.password);
        return Utils.ResponseSuccess('success', data)
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @User() user: UserToken,
    ) {
        await this.authService.logoutUser(user);
        return Utils.ResponseSuccess('success')
    }

    @UseGuards(AuthGuard)
    @Get('session')
    async session(
        @User() user: UserToken,
    ) {
        const res = await this.authService.getCurrentSession(user);
        return Utils.ResponseSuccess('success', res)
    }
}
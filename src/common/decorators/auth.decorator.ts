import { UserToken } from "@models/token.model";
import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

/**
 * 
 * Get user from request 
 */
export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const req: Request & { user: UserToken } = ctx.switchToHttp().getRequest();    
    if (req['user']) {
        return req['user'];
    } else {
        throw new UnauthorizedException('access denied');
    }
})

/**
 * Extract token from request
 */
export const Token = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const req: Request & { user: UserToken } = ctx.switchToHttp().getRequest();

    const token = req.headers.authorization

    if (token && token.split('Bearer ')) {
        return token.split('Bearer ')[1]
    } else {
        throw new UnauthorizedException('access denied');
    }
})
import { UserToken } from "@models/token.model";
import { Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { existsSync } from "fs";
import * as path from "path";

@Injectable()
export class StorageMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
        @Inject('CACHE_MANAGER') private readonly cacheManager: Cache
    ) { }

    async use(req: Request, res: Response, next: (error?: Error | any) => void) {

        if (req.method !== "GET")
            return next();

        const filePath = path.resolve(path.dirname(''), path.join('storage', req.path))

        if (!existsSync(filePath))
            throw new NotFoundException("file not found")

        // public logic file
        if (req.path.startsWith(`/public`))
            return req.query.download ? res.download(filePath) : next();

        // private logic file
        const token = req.query.token as string;

        if (!token)
            throw new UnauthorizedException("access denied");

        // Handle error jwt
        try {
            
            // Query from cache
            let tokenInCache: UserToken | null | undefined = await this.cacheManager.get(token);

            // Logic to handle token
            if (!tokenInCache) {
                const payload: UserToken = this.jwtService.verify(token)
                
                const jwtExp = payload.exp * 1000 - Date.now();

                if (jwtExp > 0) {
                    const ttl = Math.min(jwtExp, 1000 * 60 * 60 * 3);
                    await this.cacheManager.set(token, payload, ttl);
                }
            }

        } catch (error) {
            throw new UnauthorizedException("access denied")
        }

        return req.query.download ? res.download(filePath) : next();
    }
}

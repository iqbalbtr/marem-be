import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { TokenConfig } from '@config/token.config';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottleConfig } from '@config/throttle.config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { StorageConfig } from '@config/storage.config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from '@config/cache.config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventLoggerService } from '@services/event-logger.service';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';

/**
 * 
 * Config commmon module
 * please insert lib or any module who use whole application
 */
@Global()
@Module({
    imports: [
        /**
         * You can registering all common module here
         * don't forget to separate the token value
         */
        EventEmitterModule.forRoot({
            delimiter: '.',
            wildcard: true
        }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const tokenConfig = configService.get<TokenConfig>('token');
                return {
                    global: true,
                    secret: tokenConfig?.key!,
                    privateKey: tokenConfig?.key!,
                    signOptions: {
                        expiresIn: tokenConfig?.expired_in.default!,
                    } as JwtSignOptions,
                };
            },
        }),
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const thottleConfig = configService.get<ThrottleConfig>('throttle');
                return {
                    throttlers: [thottleConfig?.default!],
                    errorMessage: "to many request",
                }
            },
        }),
        ServeStaticModule.forRootAsync({
            inject: [ConfigService],
            isGlobal: true,
            useFactory: (configService: ConfigService) => {
                const storage = configService.get<StorageConfig>('storage');
                return [{
                    rootPath: join(resolve(''), storage?.root!),
                    serveRoot: '/upload',
                }]
            }
        }),
        CacheModule.registerAsync({
            inject: [ConfigService],
            isGlobal: true,
            useFactory: (configService: ConfigService) => {
                const cache = configService.get<CacheConfig>('cache');
                const connectionUrl = cache?.cache_password
                    ? `redis://:${encodeURIComponent(cache?.cache_password!)}@${cache?.host}:${cache?.port}/${cache?.db_cache}`
                    : `redis://${cache?.host}:${cache?.port}/${cache?.db_cache}`;
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: cache?.ttl!, lruSize: 5000 }),
                        }),
                        new KeyvRedis(connectionUrl),
                    ],
                }
            }
        }),
        ScheduleModule.forRoot(),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const cache = configService.get<CacheConfig>('cache');
                return {
                    connection: {
                        host: cache?.host,
                        port: cache?.port,
                        db: cache?.db_queue,
                        password: cache?.cache_password!
                    }
                }
            }
        }),
    ],
    exports: [
        JwtModule,
        ThrottlerModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        EventLoggerService,
    ]
})
export class CommonModule { }

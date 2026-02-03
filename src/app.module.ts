import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { ApiModule } from './modules/api/api.module';
import configModule from '@config/config.module';
import { LoggerMiddleware } from '@middlewares/logger.middleware';

@Module({
  imports: [
    configModule,
    DataBaseModule,
    CommonModule,
    AuthModule,
    UploadModule,
    ApiModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataBaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import configModule from '@config/config.module';
import { LoggerMiddleware } from '@middlewares/logger.middleware';
import { MailModule } from './modules/mail/mail.module';
import { FeatureModule } from './modules/feature/feature.module';

@Module({
  imports: [
    configModule,
    DataBaseModule,
    CommonModule,
    MailModule,
    AuthModule,
    UploadModule,
    FeatureModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}

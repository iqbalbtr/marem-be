import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { ProfileService } from './services/profile.service';
import { UserReportService } from './services/user-report.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ProfileService,
    UserReportService
  ],
})
export class UserModule {}

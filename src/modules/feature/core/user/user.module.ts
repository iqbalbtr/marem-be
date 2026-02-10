import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { ProfileService } from './services/profile.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ProfileService
  ],
})
export class UserModule {}

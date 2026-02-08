import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { BussinesModule } from './bussines/bussines.module';
import { CoachingModule } from './coaching/coaching.module';
import { CoachingLivecycleService } from './coaching/coaching-livecycle.service';
import { LearningModule } from './learning/learning.module';

@Module({
    imports: [
    UserModule,
    CourseModule,
    BussinesModule,
    CoachingModule,
    LearningModule
],
    providers: [CoachingLivecycleService]
})
export class ApiModule { }

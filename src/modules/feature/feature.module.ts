import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { BussinesModule } from './bussines/bussines.module';
import { CoachingModule } from './coaching/coaching.module';
import { CoachingLifecycleService } from './coaching/services/coaching-lifecycle.service';
import { LearningModule } from './learning/learning.module';
import { TeachingModule } from './teaching/teaching.module';

@Module({
    imports: [
    UserModule,
    CourseModule,
    BussinesModule,
    CoachingModule,
    LearningModule,
    TeachingModule
],
    providers: [CoachingLifecycleService]
})
export class FeatureModule { }

import { Module } from '@nestjs/common';
import { UserModule } from './core/user/user.module';
import { CourseModule } from './core/course/course.module';
import { BussinesModule } from './core/bussines/bussines.module';
import { CoachingModule } from './core/coaching/coaching.module';
import { CoachingLifecycleService } from './core/coaching/services/coaching-lifecycle.service';
import { LearningModule } from './learning/learning.module';
import { TeachingModule } from './teaching/teaching.module';
import { CertificateModule } from './core/certificate/certificate.module';

@Module({
    imports: [
    UserModule,
    CourseModule,
    BussinesModule,
    CoachingModule,
    LearningModule,
    TeachingModule,
    CertificateModule
],
    providers: [CoachingLifecycleService]
})
export class FeatureModule { }

import { Module } from '@nestjs/common';
import { UserModule } from './core/user/user.module';
import { CourseModule } from './core/course/course.module';
import { BussinesModule } from './core/bussines/bussines.module';
import { CoachingModule } from './core/coaching/coaching.module';
import { LearningModule } from './learning/learning.module';
import { TeachingModule } from './teaching/teaching.module';
import { SurveyModule } from './core/survey/survey.module';

@Module({
    imports: [
        UserModule,
        CourseModule,
        BussinesModule,
        CoachingModule,
        LearningModule,
        TeachingModule,
        SurveyModule
    ],
})
export class FeatureModule { }

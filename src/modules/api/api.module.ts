import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { BussinesModule } from './bussines/bussines.module';

@Module({
    imports: [
 
    UserModule,
 
    CourseModule,
 
    BussinesModule],
    providers: []
})
export class ApiModule { }

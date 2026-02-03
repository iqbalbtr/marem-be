import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import configModule from '@config/config.module';

@Global()
@Module({
    imports: [configModule],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class DataBaseModule { }

import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }
    
}

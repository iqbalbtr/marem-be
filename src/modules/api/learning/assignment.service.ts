import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssignmentService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

}

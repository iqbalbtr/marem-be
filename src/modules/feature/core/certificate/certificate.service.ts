import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CertificateService {

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async generateCertificate(userId: string, courseId: string) {
        
    }

}

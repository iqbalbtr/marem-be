import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LearningService {

    private asParticipant: PrismaService

    constructor(
        private readonly prismaService: PrismaService,
    ) { 
        this.asParticipant = prismaService;
    }

    async getLearnings() {

    }

    async getLearningById(learningId: string) {

    }

    async markMaterialAsCompleted(userId: string, learningId: string) {

    }

    async getUserProgress(userId: string) {

    }
}

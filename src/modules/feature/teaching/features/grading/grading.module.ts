import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { TeachingAccessService } from '../../services/teaching-access.service';

@Module({
  controllers: [GradingController],
  providers: [GradingService, TeachingAccessService],
})
export class GradingModule {}

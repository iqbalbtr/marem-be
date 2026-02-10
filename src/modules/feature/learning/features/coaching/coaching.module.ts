import { Module } from '@nestjs/common';
import { CoachingService } from './coaching.service';
import { CoachingController } from './coaching.controller';
import { CoachingModule as BaseCoachingModule } from 'src/modules/feature/coaching/coaching.module';
import { CoachingPresenceService } from 'src/modules/feature/coaching/services/coaching-presence.service';

@Module({
  imports: [BaseCoachingModule],
  controllers: [CoachingController],
  providers: [CoachingService,  CoachingPresenceService],
})
export class CoachingModule {}

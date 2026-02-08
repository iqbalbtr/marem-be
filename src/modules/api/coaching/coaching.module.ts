import { Module } from '@nestjs/common';
import { CoachingService } from './coaching.service';
import { CoachingController } from './coaching.controller';
import { CoachingLivecycleService } from './coaching-livecycle.service';
import { CoachingPresenceService } from './coaching-presence.service';
import { CoachingScheduler } from './coaching.scheduler';

@Module({
  controllers: [CoachingController],
  providers: [
    CoachingService,
    CoachingLivecycleService,
    CoachingPresenceService,
    CoachingScheduler
  ],
})
export class CoachingModule {}

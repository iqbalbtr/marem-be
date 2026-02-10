import { Module } from '@nestjs/common';
import { CoachingService } from './services/coaching.service';
import { CoachingLifecycleService } from './services/coaching-lifecycle.service';
import { CoachingPresenceService } from './services/coaching-presence.service';
import { CoachingScheduler } from './coaching.scheduler';
import { CoachingController } from './coaching.controller';

@Module({
  controllers: [CoachingController],
  providers: [
    CoachingService,
    CoachingLifecycleService,
    CoachingPresenceService,
    CoachingScheduler
  ],
  exports: [CoachingLifecycleService, CoachingPresenceService],
})
export class CoachingModule {}

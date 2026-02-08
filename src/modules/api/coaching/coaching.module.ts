import { Module } from '@nestjs/common';
import { CoachingService } from './services/coaching.service';
import { CoachingController } from './coaching.controller';
import { CoachingLifecycleService } from './services/coaching-lifecycle.service';
import { CoachingPresenceService } from './services/coaching-presence.service';
import { CoachingScheduler } from './coaching.scheduler';

@Module({
  controllers: [CoachingController],
  providers: [
    CoachingService,
    CoachingLifecycleService,
    CoachingPresenceService,
    CoachingScheduler
  ],
})
export class CoachingModule {}

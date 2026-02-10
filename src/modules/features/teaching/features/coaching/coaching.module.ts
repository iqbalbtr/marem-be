import { Module } from '@nestjs/common';
import { CoachingController } from './coaching.controller';
import { CoachingModule as BaseCoachingModule } from '../../coaching/coaching.module';
import { CoachingLifecycleService } from '../../coaching/services/coaching-lifecycle.service';
import { CoachingService } from './coaching.service';
import { CoachingPresenceService } from '../../coaching/services/coaching-presence.service';

@Module({
  controllers: [CoachingController],
  providers: [CoachingLifecycleService, CoachingService, CoachingPresenceService],
  imports: [BaseCoachingModule],
})
export class CoachingModule { }

import { Module } from '@nestjs/common';
import { CoachingController } from './coaching.controller';
import { CoachingService } from './coaching.service';
import { CoachingModule as BaseCoachingModule } from 'src/modules/feature/coaching/coaching.module';
import { CoachingLifecycleService } from 'src/modules/feature/coaching/services/coaching-lifecycle.service';
import { CoachingPresenceService } from 'src/modules/feature/coaching/services/coaching-presence.service';

@Module({
  controllers: [CoachingController],
  providers: [CoachingLifecycleService, CoachingService, CoachingPresenceService],
  imports: [BaseCoachingModule],
})
export class CoachingModule { }

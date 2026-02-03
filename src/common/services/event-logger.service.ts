import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventLoggerService implements OnModuleInit {
  private readonly logger = new Logger(EventLoggerService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.eventEmitter.onAny((event: string | string[], ...values: any[]) => {
      
      if (event.toString().startsWith('system.')) return;

      this.logger.verbose(`[EVENT EMITTED]: ${event}`);
      
      // Uncomment baris bawah jika ingin melihat payload datanya (bisa bikin console penuh)
      // console.log('   Payload:', JSON.stringify(values[0], null, 2));
      
      // DETEKSI LOOPING SEDERHANA
      // Kita bisa cek call stack atau frekuensi event di sini jika perlu
    });
  }
}
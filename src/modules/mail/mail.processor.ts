import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {

    constructor(private mailService: MailService) {
        super();
    }

    async process(job: Job<ISendMailOptions>): Promise<boolean> {
        await this.mailService.sendEmail(job.data);
        return true;
    }
}
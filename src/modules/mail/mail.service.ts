import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import appConfig, { AppConfig } from '@config/app.config';

@Injectable()
export class MailService {
  
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  
  async sendEmail(option: ISendMailOptions) {
    return this.mailerService.sendMail(option);
  }

  async sendVerificationAccount(to: string, pass: string) {

    const appConfig = this.configService.get<AppConfig>('app');

    const loginUrl = appConfig?.client.url + '/login';

    const mailOptions: ISendMailOptions = {
      to: to,
      subject: 'Verifikasi Akun',
      template: 'verification-user',
      context: {
        email: to,
        password: pass,
        url: loginUrl
      },
    };
    return this.sendEmail(mailOptions);
  }
}
import { MailConfig } from '@config/mail.config';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { resolve } from 'path';

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const mailConfig = configService.get<MailConfig>('mail');
                return {
                    transport: {
                        service: 'gmail',
                        auth: {
                            type: 'oauth2',
                            user: mailConfig?.auth.user,
                            clientId: mailConfig?.auth.clientId,
                            clientSecret: mailConfig?.auth.clientSecret,
                            refreshToken: mailConfig?.auth.refreshToken,
                            accessToken: mailConfig?.auth.accessToken
                        }
                    },
                    template: {
                        dir: resolve("src/modules/mail/templates"),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    }
                }
            }
        }),
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule { }

export type MailConfig = {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        password: string;
    }
}

export default () => ({
    mail: {
        host: process.env.MAILER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAILER_PORT || '587', 10),
        secure: process.env.MAILER_SECURE === 'true' || false,
        auth: {
            user: process.env.MAILER_AUTH_USER || '',
            password: process.env.MAILER_AUTH_PASSWORD || '',
        }
    } as MailConfig
})
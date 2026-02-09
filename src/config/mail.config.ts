export type MailConfig = {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        clientId?: string;
        clientSecret?: string;
        refreshToken?: string;
        accessToken?: string;
    }
}

export default () => ({
    mail: {
        host: process.env.MAILER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAILER_PORT || '587', 10),
        secure: process.env.MAILER_SECURE === 'true' || false,
        auth: {
            user: process.env.MAILER_AUTH_USER || '',
            clientId: process.env.MAILER_CLIENT_ID || '',
            clientSecret: process.env.MAILER_CLIENT_SECRET || '',
            refreshToken: process.env.MAILER_REFRESH_TOKEN || '',
            accessToken: process.env.MAILER_ACCESS_TOKEN || ''
        }
    } as MailConfig
})
export type AppConfig = {
    port: number;
    baseurl: string;
    node_env: "prod" | "dev";
    client: {
        url: string;
        auth: {
            cookie: string
        },
        system: {
            maintance_mode: boolean;
            android: {
                min_version: string;
                message: string;
            },
            ios: {
                min_version: string;
                message: string;
            }
        },
        bot_phone: string;
    }
}

export default () => ({
    app: {
        port: +process.env.PORT! || 3000,
        baseurl: process.env.BASE_URL,
        node_env: process.env.NODE_ENV as "prod" | "dev",
        client: {
            url: process.env.CLIENT_URL,
            auth: {
                cookie: process.env.CLIENT_AUTH_COOKIE
            },
            system: {
                maintance_mode: process.env.CLIENT_SYSTEM_MAINTANCE_MODE === 'true',
                android: {
                    min_version: process.env.CLIENT_SYSTEM_ANDROID_MIN_VERSION,
                    message: process.env.CLIENT_SYSTEM_ANDROID_MESSAGE,
                },
                ios: {
                    min_version: process.env.CLIENT_SYSTEM_IOS_MIN_VERSION,
                    message: process.env.CLIENT_SYSTEM_IOS_MESSAGE,
                }
            },
            bot_phone: process.env.BOT_WA_PHONE || ''
        },
    } as AppConfig
})
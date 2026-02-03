export type DatabaseConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    connectionLimit?: number;
    poolTimeout?: number;
}

export default () => ({
    database: {
        host: process.env.DB_HOST!,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        connectionLimit: +process.env.DB_POOL_LIMIT! || 5,
        poolTimeout: +process.env.DB_POOL_TIMEOUT! || 0,
    } as DatabaseConfig
})
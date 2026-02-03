export type CacheConfig = {
    ttl: number;
    port: number;
    host: string;
    cache_password: string;
    db_cache?: number;
    db_queue?: number;
}

export default () => ({
    cache: {
        ttl: +process.env.CACHE_TTL!,
        port: +process.env.CACHE_PORT!,
        host: process.env.CACHE_HOST!,
        cache_password: process.env.CACHE_PASSWORD!,
        db_cache: +process.env.CACHE_DB_CACHE!,
        db_queue: +process.env.CACHE_DB_QUEUE!
    } as CacheConfig
})
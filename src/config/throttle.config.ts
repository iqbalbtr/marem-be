import { ThrottlerOptions } from "@nestjs/throttler"

export type ThrottleConfig = {
    default: ThrottlerOptions;
    auth: ThrottlerOptions;
    complaint: ThrottlerOptions;
}

export default () => ({
    throttle: {
        default: {
            ttl: +process?.env?.THROTTLE_TTL! || 60,
            limit: +process?.env?.THROTTLE_LIMIT! || 60,
            blockDuration: +process?.env?.THROTTLE_BLOCK_DURATION! || 60
        },
        auth: {
            name: "auth",
            ttl: 60000,
            limit: 20,
            blockDuration: 300000,
        },
        complaint: {
            name: "complaint",
            ttl: 60000,
            limit: 10,
            blockDuration: 300000
        }
    } as ThrottleConfig
})
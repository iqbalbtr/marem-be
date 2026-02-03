export type TokenConfig = {
    key: string;
    expired_in: {
        default: string;
    }
}

export default () => ({
    token: {
        key: process.env.TOKEN_KEY,
        expired_in: {
            default: process.env.TOKEN_EXPIRE_DEFAULT || "1h",
        }
    } as TokenConfig
})
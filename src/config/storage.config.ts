export type StorageConfig = {
    root: string;
    limit: {
        default: number;
        image: number;
        video: number;
    }
}

export default () => ({
    storage: {
        root: 'storage',
        // MB size
        limit: {
            default: +process.env.STORAGE_LIMI!,
            image: +process.env.STORAGE_LIMIT_IMG!,
            video: +process.env.STORAGE_LIMIT_VIDEO!
        }
    } as StorageConfig
})
export type DeltaConfig = {
    maxDeltaDay: number
}

export default () => ({
    delta: {
        maxDeltaDay: +process.env.MAX_DELTA_DAYS! || 30
    } as DeltaConfig
})
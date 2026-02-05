import { ConfigModule } from "@nestjs/config";
import environtment from "./app.config";
import appConfig from "./app.config";
import databaseConfig from "./database.config";
import roleConfig from "./role.config";
import throttleConfig from "./throttle.config";
import tokenConfig from "./token.config";
import storageConfig from "./storage.config";
import cacheConfig from "./cache.config";
import notificationConfig from "./notification.config";

export type EnvironmetnType = typeof environtment;

export default ConfigModule.forRoot({
    envFilePath: ".env",
    load: [
        appConfig,
        databaseConfig,
        roleConfig,
        throttleConfig,
        tokenConfig,
        storageConfig,
        cacheConfig,
        notificationConfig
    ],
    isGlobal: true,
    expandVariables: true,
    cache: true
})
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class DeltaSyncDto {

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    last_sync?: Date;

    @IsOptional()
    @Type(() => Boolean)
    is_initial_sync?: boolean;
}
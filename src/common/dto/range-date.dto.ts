import { Transform, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class RangeDateDto {

    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return value;
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        return date;
    })
    @IsDate()
    start_date: Date;

    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return value;
        const date = new Date(value);
        date.setHours(23, 59, 59, 999);
        return date;
    })
    @IsDate()
    end_date: Date;


    @IsOptional()
    @IsString()
    search?: string;
}
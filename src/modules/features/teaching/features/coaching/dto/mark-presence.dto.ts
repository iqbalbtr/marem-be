import { presence_status } from "@prisma";
import { Type } from "class-transformer";
import { IsString, IsEnum, IsOptional, IsDateString } from "class-validator";

export class MarkPresenceDto {

    @IsString()
    participant_id: string;

    @IsEnum(presence_status)
    status: presence_status;

    @IsOptional()
    @IsString()
    feedback_notes?: string;

    @IsOptional()
    @Type(() => Date)
    joined_at?: Date;
    
}
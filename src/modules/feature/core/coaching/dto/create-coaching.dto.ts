import { IsString, IsDateString, IsEnum, IsOptional, IsUrl, isEnum, IsUUID, ValidateIf, IsNotEmpty } from 'class-validator';
import { audience_target, classification, coaching_type, stage, user_role } from "@prisma";

export class CreateCoachingDto {
    @IsString()
    title: string;

    @IsDateString()
    start_time: Date;

    @IsDateString()
    end_time: Date;

    @IsOptional()
    @IsUUID()
    asesor_id: string;

    @IsUrl()
    meeting_link: string;

    @IsEnum(['zoom', 'google_meet', 'ms_teams', 'other'], { message: 'meeting_platform must be one of the following values: zoom, google_meet, ms_teams, other' })
    meeting_platform: "zoom" | "google_meet" | "ms_teams" | "other";

    @IsString()
    @IsOptional()
    meeting_password?: string;

    @IsEnum(audience_target)
    audience_type: audience_target;

    @ValidateIf(obj => obj.coaching_type === coaching_type.classification)
    @IsNotEmpty({ message: 'Classification is required when coaching_type is classification' })
    @IsEnum(classification)
    classification?: classification;

    @IsEnum(coaching_type)
    coaching_type: coaching_type

    @ValidateIf(obj => obj.coaching_type === coaching_type.regional)
    @IsNotEmpty({ message: 'Regional is required' })
    @IsString()
    regional?: string;

    @IsEnum(stage)
    stage: stage;
}
import { audience_target, classification } from '@prisma';
import { IsString, IsNumber, IsBoolean, IsNotEmpty, Min, IsOptional, isUUID, IsUUID, IsEnum } from 'class-validator';

export class CreateCourseDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsUUID("4", { each: true })
    target_mentor_ids: string[];

    @IsEnum(classification)
    classification: classification;

    @IsEnum(audience_target)
    audience_target: audience_target;

    @IsNotEmpty()
    @IsBoolean()
    is_published: boolean;
}
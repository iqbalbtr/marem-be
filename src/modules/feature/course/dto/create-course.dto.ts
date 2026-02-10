import { audience_target, classification, course_type } from '@prisma';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, IsNotEmpty, Min, IsOptional, isUUID, IsUUID, IsEnum, ValidateIf } from 'class-validator';

export class CreateCourseDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsUUID("4")
    mentor_id: string;

    @IsEnum(course_type)
    course_type: course_type;

    @ValidateIf((object) => object.course_type === course_type.mandatory)
    @IsNotEmpty({ message: 'Regional wajib diisi jika tipe course adalah Mandatory' })
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    regional: string;

    @IsEnum(classification)
    classification: classification;

    @IsEnum(audience_target)
    audience_target: audience_target;

    @IsNotEmpty()
    @IsBoolean()
    is_published: boolean;
}
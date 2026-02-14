import { classification, gender, stage } from "@prisma"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min, ValidateNested } from "class-validator"

export class ParticipantProfileDto {

    @IsEnum(classification)
    clasification: classification

    @IsString()
    @Length(10, 16)
    nik: string

    @IsString()
    @Length(10, 20)
    npwp: string

    @IsEnum(gender)
    gender: gender

    @IsString()
    @Length(2, 100)
    last_education: string

    @IsEnum(stage)
    stage: stage

    @IsOptional()
    @IsUUID("4")
    asesor_id?: string
}

export class BussinessProfileDto {

    @IsString()
    @Length(3, 100)
    city: string;

    @IsString()
    @Length(3, 100)
    street: string;

    @IsString()
    @Length(3, 100)
    province: string;

    @IsString()
    @Length(3, 100)
    subdistrict: string;

    @IsString()
    @Length(3, 8)
    postal_code: string;

    @IsString()
    @Length(1, 255)
    source_joined: string;

    @IsNumber()
    @Min(1000)
    @Max(9999)
    start_year: number
}

export class BatchParticipantProfileDto {

    @IsString()
    @Length(3, 100)
    name: string

    @IsOptional()
    @IsString()
    profile?: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ParticipantProfileDto)
    participant_profile: ParticipantProfileDto

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => BussinessProfileDto)
    participat_bussiness: BussinessProfileDto
}
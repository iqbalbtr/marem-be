import { classification, gender } from "@prisma"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class ParticipantProfileDto {

    @IsEnum(classification)
    clasification: classification

    @IsString()
    @Length(10, 16)
    nik: string

    @IsString()
    @Length(10, 20)
    npwp: string

    @IsNumber()
    @Length(4, 4)
    start_year: number

    @IsEnum(gender)
    gender: gender

    @IsString()
    @Length(2, 100)
    last_education: string

}

export class BussinessProfileDto {

    @IsString()
    @Length(3, 100)
    name: string

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
    @Length(4, 4)
    birth_year: number
}

export class BatchParticipantProfileDto {

    @IsOptional()
    @IsString()
    profile?: string;

    @IsNotEmpty()
    @Type(() => ParticipantProfileDto)
    participant_profile: ParticipantProfileDto

    @IsNotEmpty()
    @Type(() => BussinessProfileDto)
    participat_bussiness: BussinessProfileDto
}
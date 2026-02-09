import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, ValidateNested } from "class-validator";

export class PublicExpertiseProfileDto {

    @IsString()
    @Length(3, 100)
    position: string;

    @IsString()
    @Length(3, 100)
    organization: string;

    @IsString()
    @Length(3, 100)
    specialization: string;

    @IsString()
    @IsOptional()
    @Length(0, 300)
    bio?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    linkedIn?: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    portofolio?: string;
}

export class PrivateExpertiseProfileDto {

    @IsString()
    @IsPhoneNumber('ID')
    phone: string;

    @IsString()
    @IsEmail()
    @Length(5, 100)
    email: string;

    @IsString()
    @Length(3, 100)
    account_number: string;

    @IsString()
    @Length(3, 100)
    account_name: string;

    @IsString()
    @Length(16, 20)
    nik: string;

    @IsString()
    @Length(3, 100)
    organization: string;

    @IsString()
    @Length(3, 100)
    position: string;

    @IsString()
    @Length(3, 100)
    specialization: string;
}

export class UpdateProfileExpertiseDto {

    @IsString()
    @Length(3, 100)
    name: string;

    @IsString()
    @IsOptional()
    profile?: string;

    @ValidateNested()
    @Type(() => PublicExpertiseProfileDto)
    public: PublicExpertiseProfileDto;

    @ValidateNested()
    @Type(() => PrivateExpertiseProfileDto)
    @IsOptional()
    private: PrivateExpertiseProfileDto;
}
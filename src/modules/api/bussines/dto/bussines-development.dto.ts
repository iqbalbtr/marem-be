import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsUrl,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { business_phase } from '@prisma';

export class SocialMediaDto {
  @IsEnum(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'], { message: 'platform must be one of the following values: facebook, instagram, twitter, linkedin, tiktok' })
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';

  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsUrl()
  url: string;
}

export class BussinesPermitsDto {

  @IsEnum(['nib', 'siup', 'pirt', 'halal', 'other'], { message: 'permit_type must be one of the following values: nib, siup, pirt, halal, other' })
  permit_type: 'nib' | 'siup' | 'pirt' | 'halal' | 'other';

  @IsNumber()
  @IsString()
  permit_number: string;

}

export class BusinessDevelopmentDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsEnum(business_phase)
  phase: business_phase;

  @IsInt()
  @Min(0)
  employees: number;

  @IsNumber()
  @Min(0)
  revenue: number;

  @IsNumber()
  @Min(0)
  capacity: number;

  @IsOptional()
  @IsBoolean()
  is_legalized?: boolean;

  @IsOptional()
  @IsBoolean()
  has_financial_records?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BussinesPermitsDto)
  bussines_permits?: BussinesPermitsDto[] = [];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaDto)
  social_medias?: SocialMediaDto[] = [];
}
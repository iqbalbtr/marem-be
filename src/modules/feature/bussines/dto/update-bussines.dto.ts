import { business_type, product_type } from '@prisma';
import {
    IsString,
    IsInt,
    IsEnum,
    IsNumber,
    MaxLength,
    Min,
    IsNotEmpty,
    IsUUID
} from 'class-validator';


export class BusinessProfileDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsInt()
    @Min(1900)
    birth_year: number;

    @IsString()
    @IsNotEmpty()
    province: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    postal_code: string;

    @IsString()
    @MaxLength(50)
    nib: string;

    @IsEnum(business_type)
    business_type: business_type;

    @IsString()
    @MaxLength(100)
    business_field: string;

    @IsInt()
    @Min(0)
    total_sku: number;

    @IsEnum(product_type)
    product_type: product_type;

    @IsNumber()
    @Min(0)
    average_product_price: number;

    @IsInt()
    @Min(0)
    monthly_product_capacity: number;
}
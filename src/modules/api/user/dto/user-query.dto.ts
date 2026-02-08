import { IsEnum, IsOptional } from "class-validator";
import { gender, user_role } from "prisma/generated/prisma/browser";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class UserQueryDto extends PaginationDto {
    
    @IsOptional()
    @IsEnum(user_role)
    role?: user_role;

    @IsOptional()
    @IsEnum(gender)
    gender?: gender;
}
import { audience_target, classification } from "@prisma";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class QueryCourseDto extends PaginationDto {
    
    @IsOptional()
    @IsEnum(classification)
    classification?: classification

    @IsOptional()
    @IsEnum(audience_target)
    audience_target?: audience_target;
}
import { IsBoolean, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class QueryLearningDto extends PaginationDto {

    @IsOptional()
    @IsBoolean()
    is_classification?: boolean = false;

    @IsOptional()
    @IsBoolean()
    is_regional?: boolean = false;
}
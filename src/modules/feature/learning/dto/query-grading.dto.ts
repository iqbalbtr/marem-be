import { submission_status } from "@prisma";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class QueryGradingDto extends PaginationDto {

    @IsOptional()
    @IsEnum(submission_status, { message: `status must be one of: ${Object.values(submission_status).join(', ')}` })
    status?: submission_status
}
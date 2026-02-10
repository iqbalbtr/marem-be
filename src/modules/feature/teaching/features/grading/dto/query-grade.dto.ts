import { submission_status } from "@prisma";
import { IsBoolean, IsEnum, isEnum, IsOptional, IsUUID } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class QueryGradeDto extends PaginationDto {

    @IsOptional()
    @IsEnum(submission_status, { message: 'status must be a valid submission status' })
    status?: submission_status

    @IsOptional()
    @IsUUID()
    material_item_id?: string;
}
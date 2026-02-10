import { submission_status } from "@prisma";
import { IsEnum, IsOptional, IsUUID, isUUID } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class QueryGradeDto extends PaginationDto {

    @IsOptional()
    @IsUUID("4")
    material_item_id?: string;

    @IsOptional()
    @IsEnum(submission_status, { message: `status must be one of the following values: ${Object.values(submission_status).join(', ')}` })
    status?: submission_status

}
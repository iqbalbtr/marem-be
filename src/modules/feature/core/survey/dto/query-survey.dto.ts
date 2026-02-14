import { survey_status, user_role } from "@prisma";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class QuerySurveyDto extends PaginationDto {
    @IsOptional()
    @IsEnum(user_role)
    target_role?: user_role;

    @IsOptional()
    @IsEnum(survey_status)
    status?: survey_status;
}
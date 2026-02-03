import { PaginationDto } from "src/shared/pagination-dto";
import { IntersectionType } from "@nestjs/swagger";
import { RangeDateDto } from "src/shared/range-date.dto";

export class RangeDatePaggingDto extends IntersectionType(
    PaginationDto,
    RangeDateDto
) { }
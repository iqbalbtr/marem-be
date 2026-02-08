import { PaginationDto } from "src/common/dto/pagination-dto";
import { IntersectionType } from "@nestjs/swagger";
import { RangeDateDto } from "src/common/dto/range-date.dto";

export class RangeDatePaggingDto extends IntersectionType(
    PaginationDto,
    RangeDateDto
) { }
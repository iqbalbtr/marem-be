import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class GradeMentorDto {

    @IsNumber()
    @Min(0)
    score: number;

    @IsOptional()
    @IsString()
    feedback?: string;
}
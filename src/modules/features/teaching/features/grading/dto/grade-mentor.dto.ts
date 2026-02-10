import { IsOptional, IsString, Min } from "class-validator";

export class GradeMentorDto {

    @Min(0)
    score: number;

    @IsOptional()
    @IsString()
    feedback: string;
}


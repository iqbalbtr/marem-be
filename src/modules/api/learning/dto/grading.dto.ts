import { module_category } from "@prisma";
import { Type } from "class-transformer";
import { IsEnum, isEnum, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min, ValidateNested } from "class-validator";

abstract class BaseGradingDto {
    @IsEnum([module_category.assignment, module_category.quiz])
    category: module_category;
}

export class AssignmentGradingDto extends BaseGradingDto {

    @IsOptional()
    @IsUrl()
    file_url: string;

    @IsOptional()
    @IsString()
    answer_text: string;
}

export class QuizItemDto {

    @IsOptional()
    @IsNumber()
    total_time_seconds: number;

    @IsUUID('4')
    question_id: string;

    @IsUUID('4')
    answer_id: string;
}

export class QuizGradingDto extends BaseGradingDto {

    @ValidateNested({ each: true })
    @Type(() => QuizItemDto)
    answers: QuizItemDto[];

}

export class GradingDto {

    @ValidateNested()
    @Type(() => BaseGradingDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'category',
            subTypes: [
                { name: module_category.assignment, value: AssignmentGradingDto },
                { name: module_category.quiz, value: QuizGradingDto },
            ]
        }
    })
    data: AssignmentGradingDto | QuizGradingDto;
}

export class GradeMentorDto {
    
    @Min(0)
    score: number;

    @IsUUID('4')
    participant_id: string;

    @IsOptional()
    @IsString()
    feedback: string;
}


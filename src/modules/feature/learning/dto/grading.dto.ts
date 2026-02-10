import { module_category } from "@prisma";
import { Type } from "class-transformer";
import { IsEnum, isEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min, ValidateNested } from "class-validator";

abstract class BaseGradingDto {
    @IsEnum([module_category.assignment, module_category.quiz], { message: 'category must be either assignment or quiz' })
    category: module_category;
}

export class AssignmentGradingDto extends BaseGradingDto {

    @IsOptional()
    @IsUrl()
    file_url: string;

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
    @IsNotEmpty()
    @Type(() => BaseGradingDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'category',
            subTypes: [
                { name: 'assignment', value: AssignmentGradingDto },
                { name: 'quiz', value: QuizGradingDto },
            ]
        }
    })
    data: AssignmentGradingDto | QuizGradingDto;
}
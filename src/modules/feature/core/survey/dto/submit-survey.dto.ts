import { survey_category, user_role } from "@prisma";
import { Type } from "class-transformer";
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
    IsArray,
    Length,
    IsNumber,
    Min,
    Max
} from "class-validator";

export abstract class BaseSubmitItemSurveyDto {
    @IsUUID("4")
    id: string;
    @IsEnum(survey_category)
    category: survey_category;
}

export class DateSubmitSurveyItemDto extends BaseSubmitItemSurveyDto {
    @Type(() => Date)
    @IsDate()
    response_date: Date;
}

export class ParagraphSubmitSurveyItemDto extends BaseSubmitItemSurveyDto {
    @IsOptional()
    @IsString()
    response_text?: string;
}

export class CheckboxSubmitSurveyDto extends BaseSubmitItemSurveyDto {
    @IsArray()
    @IsUUID('4', { each: true })
    selected: string[];
}

export class OptionSubmitSurveyDto extends BaseSubmitItemSurveyDto {
    @IsUUID('4')
    selected_id: string
}

export class AnsweredSubmitSurveyItemDto extends BaseSubmitItemSurveyDto { 
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    response_text: string;
}

export class RatingSubmitSurveyItemDto extends BaseSubmitItemSurveyDto {

    @IsNumber()
    @Min(0)
    @Max(5)
    rate: number;
}

export class SubmitSurveyQuestionDto {
    @IsUUID("4")
    question_id: string;

    @ValidateNested()
    @Type(() => BaseSubmitItemSurveyDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'category',
            subTypes: [
                { value: DateSubmitSurveyItemDto, name: survey_category.date },
                { value: ParagraphSubmitSurveyItemDto, name: survey_category.paragraph },
                { value: OptionSubmitSurveyDto, name: survey_category.options },
                { value: CheckboxSubmitSurveyDto, name: survey_category.checkboxes },
                { value: AnsweredSubmitSurveyItemDto, name: survey_category.answered },
                { value: RatingSubmitSurveyItemDto, name: survey_category.rating },
            ]
        },
    })
    data: DateSubmitSurveyItemDto | ParagraphSubmitSurveyItemDto | OptionSubmitSurveyDto | CheckboxSubmitSurveyDto | AnsweredSubmitSurveyItemDto | RatingSubmitSurveyItemDto;
}

export class SubmitSurveyDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubmitSurveyQuestionDto)
    questions: SubmitSurveyQuestionDto[];
}
import { survey_category, survey_status, user_role } from "@prisma"; 
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
    IsArray 
} from "class-validator";

export abstract class BaseItemSurveyDto {
    @IsUUID("4")
    id: string;
    @IsEnum(survey_category)
    category: survey_category;
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsBoolean()
    @IsOptional()
    required: boolean = false;
}

export class OptionItemDto {
    @IsUUID("4")
    id: string;
    @IsString()
    @IsNotEmpty()
    text_option: string;
}

export class DateSurveyItemDto extends BaseItemSurveyDto {
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    default_date?: Date;
}

export class ParagraphSurveyItemDto extends BaseItemSurveyDto {
    @IsOptional()
    @IsString()
    placeholder?: string;
}

export class CheckboxSurveyDto extends BaseItemSurveyDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionItemDto)
    options: OptionItemDto[];
}

export class OptionSurveyDto extends BaseItemSurveyDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionItemDto)
    options: OptionItemDto[];
}

export class BaseOnlySurveyItemDto extends BaseItemSurveyDto {}

export class CreateSurveyQuestionDto {
    @IsUUID("4")
    @IsOptional()
    question_group_id?: string;

    @ValidateNested()
    @Type(() => BaseItemSurveyDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'category',
            subTypes: [
                { value: DateSurveyItemDto, name: survey_category.date },
                { value: ParagraphSurveyItemDto, name: survey_category.paragraph },
                { value: OptionSurveyDto, name: survey_category.options },
                { value: CheckboxSurveyDto, name: survey_category.checkboxes },
                { value: BaseOnlySurveyItemDto, name: survey_category.answered },
                { value: BaseOnlySurveyItemDto, name: survey_category.rating },
            ]
        },
    })
    data: DateSurveyItemDto | ParagraphSurveyItemDto | OptionSurveyDto | CheckboxSurveyDto | BaseOnlySurveyItemDto;
}

export class CreateSurveyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsBoolean()
    can_update_response: boolean = false;

    @IsEnum(user_role)
    target_role: user_role;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(survey_status)
    status: survey_status;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSurveyQuestionDto)
    questions: CreateSurveyQuestionDto[];
}
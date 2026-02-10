import { Transform, Type } from 'class-transformer';
import {
    IsString, IsNumber, IsBoolean, IsEnum, IsArray,
    ValidateNested, IsOptional, IsUUID, IsDateString, Min,
    Max
} from 'class-validator';
import { ModuleCategory, QuizType, SubmissionFormat } from '../course.constant';

export abstract class BaseItemDataDto {
    @IsEnum(ModuleCategory)
    category: ModuleCategory;
}

export class ArticleDataDto extends BaseItemDataDto {
    category = ModuleCategory.ARTICLE; 

    @IsString()
    content: string;

    @IsNumber()
    @IsOptional()
    estimated_read_time_minutes?: number;
}

export class AssignmentDataDto extends BaseItemDataDto {
    category = ModuleCategory.ASSIGNMENT;

    @IsEnum(QuizType)
    assignment_type: QuizType;

    @IsString()
    instructions: string;

    @IsDateString()
    due_date: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    max_score: number;

    @IsEnum(SubmissionFormat)
    submission_format: SubmissionFormat;
}

export class QuizDataDto extends BaseItemDataDto {
    category = ModuleCategory.QUIZ;

    @IsString()
    title: string;

    @IsOptional()
    @IsNumber()
    time_limit_seconds?: number;

    @IsNumber()
    @Min(0)
    @Transform(({ value, obj }) => {
        const totalPoints = obj.questions?.reduce((acc, curr) => acc + curr.points, 0) || 0;
        if (value > totalPoints) {
            throw new Error('passing_score cannot be greater than total points of all questions');
        }
        return value;
    })
    passing_score: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuizQuestionDto)
    questions: QuizQuestionDto[];
}

export class QuizOptionDto {
    @IsUUID()
    id: string;

    @IsString()
    option_text: string;

    @IsBoolean()
    is_correct: boolean;
}

export class QuizQuestionDto {
    @IsUUID()
    id: string;

    @IsString()
    question_text: string;

    @IsNumber()
    points: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuizOptionDto)
    options: QuizOptionDto[];
}

export class CreateModuleItemDto {
    @IsUUID()
    id: string;

    @IsString()
    title: string;

    @IsEnum(ModuleCategory)
    category: ModuleCategory;

    @IsNumber()
    sequence: number;

    @IsBoolean()
    is_published: boolean;

    @ValidateNested()
    @Type(() => BaseItemDataDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'category',
            subTypes: [
                { value: ArticleDataDto, name: ModuleCategory.ARTICLE },
                { value: QuizDataDto, name: ModuleCategory.QUIZ },
                { value: AssignmentDataDto, name: ModuleCategory.ASSIGNMENT },
            ],
        },
    })
    data: ArticleDataDto | QuizDataDto | AssignmentDataDto;
}

export class ModuleDto {
    @IsUUID()
    id: string

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    sequence: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateModuleItemDto)
    items: CreateModuleItemDto[];
}

export class CreateModuleDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModuleDto)
    modules: ModuleDto[];
}
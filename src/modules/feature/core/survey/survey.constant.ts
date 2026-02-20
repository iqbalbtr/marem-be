import { survey_category, survey_items, survey_reponse_item } from "@prisma";
import { AnsweredSubmitSurveyItemDto, CheckboxSubmitSurveyDto, DateSubmitSurveyItemDto, OptionSubmitSurveyDto, ParagraphSubmitSurveyItemDto, RatingSubmitSurveyItemDto } from "./dto/submit-survey.dto";
import { BaseOnlySurveyItemDto, CheckboxSurveyDto, DateSurveyItemDto, OptionSurveyDto, ParagraphSurveyItemDto } from "./dto/create-survey.dto";

export type SurveyAnswerMap = {
    [survey_category.date]: survey_reponse_item & { answer: DateSubmitSurveyItemDto };
    [survey_category.paragraph]: survey_reponse_item & { answer: ParagraphSubmitSurveyItemDto };
    [survey_category.options]: survey_reponse_item & { answer: OptionSubmitSurveyDto };
    [survey_category.checkboxes]: survey_reponse_item & { answer: CheckboxSubmitSurveyDto };
    [survey_category.rating]: survey_reponse_item & { answer: RatingSubmitSurveyItemDto };
    [survey_category.answered]: survey_reponse_item & { answer: AnsweredSubmitSurveyItemDto };
};

export type SurveyItemMap = {
    [survey_category.date]: survey_items & { data: DateSurveyItemDto };
    [survey_category.paragraph]: survey_items & { data: ParagraphSurveyItemDto };
    [survey_category.options]: survey_items & { data: OptionSurveyDto };
    [survey_category.checkboxes]: survey_items & { data: CheckboxSurveyDto };
    [survey_category.rating]: survey_items & { data: BaseOnlySurveyItemDto };
    [survey_category.answered]: survey_items & { data: BaseOnlySurveyItemDto };
}
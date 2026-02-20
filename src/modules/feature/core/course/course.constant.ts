export enum ModuleCategory {
  ARTICLE = 'article',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
}

export enum SubmissionType {
  pre_test = 'pre_test',
  post_test = 'post_test',
}

export enum SubmissionFormat {
  FILE_UPLOAD = 'file_upload',
  TEXT_ENTRY = 'text_entry',
  LINK_SUBMISSION = 'link_submission',
}

export interface BaseItemData {
  category: ModuleCategory;
}

export interface ArticleData extends BaseItemData {
  category: ModuleCategory.ARTICLE;
  content: string;
  estimated_read_time_minutes?: number;
}

export interface AssignmentData extends BaseItemData {
  category: ModuleCategory.ASSIGNMENT;
  submission_type: SubmissionType;
  instructions: string;
  due_date: string;
  max_score: number;
  submission_format: SubmissionFormat;
}

export interface QuizOption {
  id: string; 
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string; 
  question_text: string;
  points: number;
  options: QuizOption[];
}

export interface QuizData extends BaseItemData {
  category: ModuleCategory.QUIZ; 
  title: string;
  time_limit_seconds?: number;
  passing_score: number;
  questions: QuizQuestion[];
}

export type ModuleItemData = ArticleData | AssignmentData | QuizData;

export interface ModuleItem {
  id: string; 
  title: string;
  category: ModuleCategory;
  sequence: number;
  is_published: boolean;
  data: ModuleItemData;
}

export interface Module {
  id: string; 
  title: string;
  description?: string;
  sequence: number;
  items: ModuleItem[];
}

export interface CreateModuleRequest {
  modules: Module[];
}

export type DiscriminatedModuleItem =
  | { category: ModuleCategory.ARTICLE; data: ArticleData;[key: string]: any }
  | { category: ModuleCategory.ASSIGNMENT; data: AssignmentData;[key: string]: any }
  | { category: ModuleCategory.QUIZ; data: QuizData;[key: string]: any };
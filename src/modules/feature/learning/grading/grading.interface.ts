import { UserToken } from "@models/token.model";
import { course_module_items, course_modules, submission_status } from "@prisma";

export interface GradingResult {
    score: number | null;
    status: submission_status;
    feedback?: string;
    metadata?: any;
}

export interface IGradingStrategy {
    execute(
        user: UserToken,
        item: course_module_items & { module: course_modules },
        submissionData: any,  
    ): Promise<GradingResult>;
}
import { UserToken } from "@models/token.model";
import { course_module_items, submission_status } from "@prisma";

export interface GradingResult {
    score: number | null;
    status: submission_status;
    feedback?: string;
    metadata?: any;
}

export interface IGradingStrategy {
    execute(
        user: UserToken,
        item: course_module_items,
        submissionData: any,  
    ): Promise<GradingResult>;
}
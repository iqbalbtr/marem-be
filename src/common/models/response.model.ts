export type PaginationType = {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    next_page: number | null;
    prev_page: number | null;
}

export interface BaseResponse<T = null> {
    status: boolean;
    message: string;
    data?: T;
    pagination?: PaginationType
}

export interface ErrorResponse<T = null> {
    status: false;
    errors: string;
    error_fields?: T;
}
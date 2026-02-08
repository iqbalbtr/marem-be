import { BaseResponse, PaginationType } from "@models/response.model";
import { CostType, Prisma, PrismaClient } from "@prisma";
import { Response } from "express";

export class Utils {
    static ResponseSuccess<T>(message: string = 'success', data?: T, pagination?: PaginationType): BaseResponse<T> {
        return {
            data,
            message,
            status: true,
            pagination
        };
    }

    static ResponseDownloadBuffer(res: Response, filename: string, buffer: Buffer, contentType: string) {
        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    static ResponseRedirect(url: string, message?: string, platform?: string) {
        return {
            url,
            message: message || '',
            platform: platform || 'web',
        }
    }


    static dateConvert(val: number | Date | string) {

        if (!val)
            return ""

        const date = new Date(val);

        const month = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        return `${date.getDate().toString().padStart(2, "0")} ${month[date.getMonth()]} ${date.getFullYear()}`
    }

    static emptyValueCheck(val?: string) {
        return val == 'null' || !val || val == 'undefined' ? 'Tidak Diketahui' : val
    }


}

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

    static getWarrantyEndDate(startDate: Date, long: number) {

        return new Date(startDate.getTime() + (long * 24 * 60 * 60 * 1000));
    }

    static calculateCost(total: number, amount: number, type: CostType) {
        let result = {
            totalDeduction: 0,
            finalCost: total,
        }

        if (type === CostType.percentage) {
            result.totalDeduction = (total * (amount / 100));
        }

        if (type === CostType.fixed) {
            result.totalDeduction = amount;
        }

        result.finalCost = total - result.totalDeduction;

        return result

    }
}

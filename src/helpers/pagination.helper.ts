import { Prisma, PrismaClient } from "@prisma";

export type PaginationProps<T extends Prisma.ModelName> = {
  prismaService: PrismaClient;
  page: number;
  per_page: number;
  table: T;
  whereQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where'];
  orderByQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy'];
  includeQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['include'];
  selectQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['select'];
};

export class PaginationHelper {
  static async createPaginationData<T extends Prisma.ModelName>({
    prismaService,
    page,
    per_page,
    table,
    whereQuery,
    orderByQuery,
    includeQuery,
    selectQuery,
  }: PaginationProps<T>) {

    const modelKey = (table as string).toLowerCase();

    const modelDelegate = (prismaService as any)[modelKey];

    if (!modelDelegate) {
      throw new Error(`Model '${table}' tidak ditemukan di Prisma Client.`);
    }

    const total_items = await modelDelegate.count({
      where: whereQuery,
    });
    

    const total_pages = Math.ceil(total_items / per_page);

    const data = await modelDelegate.findMany({
      where: whereQuery,
      include: includeQuery,
      select: selectQuery,
      orderBy: orderByQuery,
      skip: (page - 1) * per_page,
      take: per_page,
    });

    return {
      data,
      pagination: {
        current_page: page,
        per_page,
        total_items: total_items,
        total_pages,
        next_page: page >= total_pages ? null : page + 1,
        prev_page: page <= 1 ? null : page - 1,
      },
    };
  }
}
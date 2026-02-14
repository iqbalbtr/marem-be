import { Prisma, PrismaClient } from "@prisma";

type UncapitalizeModel<T extends string> = Uncapitalize<T>;

type ModelResult<T extends Prisma.ModelName> = Prisma.TypeMap['model'][T]['operations']['findMany']['result'];

export type PaginationProps<T extends Prisma.ModelName, R = ModelResult<T>> = {
  prismaService: PrismaClient;
  page: number;
  per_page: number;
  table: T;
  whereQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where'];
  orderByQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy'];
  includeQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['include'];
  selectQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['select'];
  transformData?: (data: ModelResult<T>) => R;
};

export class PaginationHelper {

  static getWhereQuery<T extends Prisma.ModelName>(
    table: T,
    whereQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where'],
  ): NonNullable<Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where']> {
    return (whereQuery ?? {}) as NonNullable<Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where']>;
  }

  static getOrderByQuery<T extends Prisma.ModelName>(
    table: T,
    orderByQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy'],
  ): NonNullable<Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy']> {
    return (orderByQuery ?? {}) as NonNullable<Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy']>;
  }

  static getIncludeQuery<T extends Prisma.ModelName>(
    table: T,
    includeQuery?: Prisma.TypeMap['model'][T]['operations']['findMany']['args']['include'],
  ): NonNullable<Prisma.TypeMap['model'][T]['operations']['findMany']['args']['include']> {
    return (includeQuery ?? {}) as NonNullable<Prisma.TypeMap['model'][T]['operations']['findMany']['args']['include']>;
  }

  static async createPaginationData<T extends Prisma.ModelName, R = ModelResult<T>>({
    prismaService,
    page,
    per_page,
    table,
    whereQuery,
    orderByQuery,
    includeQuery,
    selectQuery,
    transformData,
  }: PaginationProps<T, R>) {

    const modelKey = (table.charAt(0).toLowerCase() + table.slice(1)) as UncapitalizeModel<T>;

    const modelDelegate = (prismaService as any)[modelKey];

    if (!modelDelegate) {
      throw new Error(`Model '${table}' (key: ${modelKey}) tidak ditemukan di Prisma Client.`);
    }

    const total_items = await modelDelegate.count({
      where: whereQuery,
    });

    const total_pages = Math.ceil(total_items / per_page);

    const queryArgs: any = {
      where: whereQuery,
      orderBy: orderByQuery,
      skip: (page - 1) * per_page,
      take: per_page,
    };

    if (selectQuery) {
      queryArgs.select = selectQuery;
    } else if (includeQuery) {
      queryArgs.include = includeQuery;
    }

    let data = await modelDelegate.findMany(queryArgs);

    if (transformData) {
      data = transformData(data);
    }

    return {
      data: data as R,
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
import { Prisma } from "@prisma/client";
import type { TABLE_FILTER } from "server/routers/productsRouter";
import type { z } from "zod";

export function getOrderByFromInput<T extends { sorting?: { desc: boolean; id: string }[] }>(
  input: T,
) {
  const orderBy =
    (input.sorting?.length ?? 0) >= 1
      ? input.sorting?.reduce(
          (ac, cv) => ({
            ...ac,
            ...createOrderByObj(cv),
          }),
          {},
        )
      : { createdAt: "desc" };

  return orderBy;
}

export function createOrderByObj(sort: { desc: boolean; id: string }) {
  if (["month", "year"].includes(sort.id)) {
    return { date: { [sort.id]: getSortingDir(sort) } };
  }

  return { [sort.id]: getSortingDir(sort) };
}

export function getSortingDir(cv: { desc?: boolean | null }): Prisma.SortOrder {
  if (!cv.desc) return Prisma.SortOrder.asc;
  return Prisma.SortOrder.desc;
}

export function createPrismaWhereFromFilters(
  filters: z.infer<typeof TABLE_FILTER>[] | undefined,
): any {
  const andClause: any[] = [];

  if (!filters) {
    return {};
  }

  for (const filter of filters) {
    if (!filter.type || !filter.content) continue;

    const addMode = ["string"].includes(filter.filterType);
    const content = filter.filterType === "date" ? new Date(filter.content) : filter.content;

    console.log({ content });

    const obj = {
      [filter.name]: {
        [filter.type]: content,
        mode: addMode ? Prisma.QueryMode.insensitive : undefined,
      },
    };

    andClause.push(obj);
  }

  return { AND: andClause };
}

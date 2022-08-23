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
  if (sort.id.includes("-")) {
    const [parent, child] = sort.id.split("-") as [string, string];

    return { [parent]: { [child]: sort.desc ? "desc" : "asc" } };
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

    const isStringType = ["string"].includes(filter.filterType);
    const setObj = filter.name.split(".").length >= 2;
    const content = filter.filterType === "date" ? new Date(filter.content) : filter.content;

    if (setObj) {
      andClause.push(
        createObj(filter.name, {
          [filter.type]: content,
          mode: isStringType ? Prisma.QueryMode.insensitive : undefined,
        }),
      );
    } else {
      const obj = {
        [filter.name]: {
          [filter.type]: content,
          mode: isStringType ? Prisma.QueryMode.insensitive : undefined,
        },
      };

      andClause.push(obj);
    }
  }

  return { AND: andClause };
}

function createObj(name: string, value: any) {
  const obj: Record<string, any> = {};

  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (char === ".") {
      const parent = name.substring(0, i);
      const child = name.substring(i + 1);
      obj[parent] = { [child]: value };
    }
  }

  return obj;
}

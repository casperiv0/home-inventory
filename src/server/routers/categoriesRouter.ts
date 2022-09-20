import { TRPCError } from "@trpc/server";
import { t } from "server/trpc";
import { getOrderByFromInput } from "utils/db-utils";
import { prisma } from "utils/prisma";
import { isInHouse } from "utils/trpc";
import { z } from "zod";

export const categoriesRouter = t.router({
  getCategoriesByHouseId: isInHouse
    .input(
      z.object({
        houseId: z.string(),
        page: z.number(),
        sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = input.page * 25;

      const [totalCount, items] = await Promise.all([
        prisma.category.count({
          where: { houseId: input.houseId },
        }),
        prisma.category.findMany({
          take: 25,
          skip,
          orderBy: input.sorting ? getOrderByFromInput(input) : { createdAt: "asc" },
          where: { houseId: input.houseId },
        }),
      ]);

      return { maxPages: Math.floor(totalCount / 25), items };
    }),
  addCategory: isInHouse
    .input(
      z.object({
        houseId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.category.findUnique({
        where: { name_houseId: { houseId: input.houseId, name: input.name } },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name with that category already exists",
        });
      }

      const category = await prisma.category.create({
        data: { houseId: input.houseId, name: input.name },
      });

      return category;
    }),
  editCategory: isInHouse
    .input(
      z.object({
        houseId: z.string(),
        name: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await prisma.category.update({
        where: { id: input.id },
        data: { houseId: input.houseId, name: input.name },
      });

      return category;
    }),
  deleteCategory: isInHouse
    .input(
      z.object({
        houseId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await prisma.category.findUnique({
        where: { name_houseId: { houseId: input.houseId, name: input.name } },
      });

      if (!category) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prisma.category.delete({
        where: { name_houseId: { houseId: input.houseId, name: input.name } },
      });

      return true;
    }),
});

import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { getOrderByFromInput } from "utils/db-utils";
import { prisma } from "utils/prisma";
import { z } from "zod";

export const categoriesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .middleware(async ({ ctx, next, rawInput }) => {
    // todo: make this a separate function
    const houseId =
      rawInput &&
      typeof rawInput === "object" &&
      "houseId" in rawInput &&
      (rawInput as Record<string, string>).houseId;

    if (!houseId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Must include `houseId`" });
    }

    const house = await prisma.house.findFirst({
      where: { id: (rawInput as any).houseId, users: { some: { id: ctx.dbUser!.id } } },
    });

    if (!house) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return next();
  })
  .query("getCategoriesByHouseId", {
    input: z.object({
      houseId: z.string(),
      page: z.number(),
      sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
    }),
    async resolve({ input }) {
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
    },
  })
  .mutation("addCategory", {
    input: z.object({
      houseId: z.string(),
      name: z.string(),
    }),
    async resolve({ input }) {
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
    },
  })
  .mutation("editCategory", {
    input: z.object({
      houseId: z.string(),
      name: z.string(),
      id: z.string(),
    }),
    async resolve({ input }) {
      const category = await prisma.category.update({
        where: { id: input.id },
        data: { houseId: input.houseId, name: input.name },
      });

      return category;
    },
  })
  .mutation("deleteCategory", {
    input: z.object({
      houseId: z.string(),
      name: z.string(),
    }),
    async resolve({ input }) {
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
    },
  });

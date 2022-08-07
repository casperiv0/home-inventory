import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { createPrismaWhereFromFilters, getOrderByFromInput } from "utils/db-utils";
import { prisma } from "utils/prisma";
import { z } from "zod";

export const TABLE_FILTER = z.object({
  name: z.string(),
  filterType: z.enum(["string", "date", "number", "enum"]),
  content: z.string().or(z.number()).optional(),
  type: z.enum(["equals", "contains", "lt", "gt"]).optional(),
  options: z.array(z.string()).optional(),
});

export const productsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .middleware(async ({ ctx, next, rawInput }) => {
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
  .query("getProductsByHouseId", {
    input: z.object({
      houseId: z.string(),
      page: z.number(),
      sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
      filters: z.array(TABLE_FILTER).optional(),
    }),
    async resolve({ input }) {
      const skip = input.page * 25;

      const [totalCount, items] = await Promise.all([
        prisma.product.count({
          where: { houseId: input.houseId, ...createPrismaWhereFromFilters(input.filters) },
        }),
        prisma.product.findMany({
          take: 25,
          skip,
          orderBy: input.sorting ? getOrderByFromInput(input) : { createdAt: "asc" },
          where: { houseId: input.houseId, ...createPrismaWhereFromFilters(input.filters) },
          include: { category: true },
        }),
      ]);

      return { maxPages: Math.floor(totalCount / 25), items };
    },
  })
  .mutation("addProduct", {
    input: z.object({
      houseId: z.string(),
      name: z.string().min(2),
      price: z.number().min(1),
      quantity: z.number().min(1),
      category: z.string().nullable().optional(),
      expireDate: z.date().or(z.string()).optional().nullable(),
    }),
    async resolve({ ctx, input }) {
      const existing = await prisma.product.findFirst({
        where: { name: input.name, houseId: input.houseId },
      });

      /**
       * if there's already a product with the same name,
       * update the existing product with the new quantity
       * and append to price to the prices array
       */
      if (existing) {
        const updatedProduct = await prisma.product.update({
          where: {
            id: existing.id,
          },
          data: {
            quantity: existing.quantity + input.quantity,

            // input.price = for 1 item, times the quantity -> total amount for the product.
            prices: [...existing.prices, input.price * input.quantity],
          },
        });

        return updatedProduct;
      }

      const product = await prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          quantity: input.quantity,
          houseId: input.houseId,
          userId: ctx.dbUser!.id,
          expirationDate: input.expireDate ? new Date(input.expireDate) : undefined,
          categoryId: input.category,
          prices: [input.price * input.quantity],
        },
      });

      return product;
    },
  })
  .mutation("editProduct", {
    input: z.object({
      id: z.string().min(1),
      houseId: z.string().min(1),
      name: z.string().min(2),
      price: z.number().min(1),
      quantity: z.number().min(1),
      category: z.string().nullable().optional(),
      expireDate: z.date().or(z.string()).optional().nullable(),
    }),
    async resolve({ input }) {
      const product = await prisma.product.findFirstOrThrow({
        where: { id: input.id, houseId: input.houseId },
      });

      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: {
          name: input.name,
          quantity: input.quantity,
          price: input.price,
          expirationDate: input.expireDate ? new Date(input.expireDate) : undefined,
          categoryId: input.category,

          // input.price = for 1 item, times the quantity -> total amount for the product.
          prices: [input.price * input.quantity],
        },
      });

      return updatedProduct;
    },
  })
  .mutation("deleteProduct", {
    input: z.object({
      id: z.string().min(1),
      houseId: z.string().min(1),
    }),
    async resolve({ input }) {
      const product = await prisma.product.findFirstOrThrow({
        where: { id: input.id, houseId: input.houseId },
      });

      await prisma.product.delete({
        where: { id: product.id },
      });

      return true;
    },
  });

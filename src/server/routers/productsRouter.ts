import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { prisma } from "utils/prisma";
import { z } from "zod";

export const productsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .middleware(async ({ ctx, next, rawInput }) => {
    // todo: check if user has access to this house

    if (rawInput && typeof rawInput === "object" && "houseId" in rawInput) {
      const house = await prisma.house.findFirst({
        where: { id: (rawInput as any).houseId, users: { some: { id: ctx.dbUser!.id } } },
      });

      if (!house) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }

    return next();
  })
  .query("getProductsByHouseId", {
    input: z.object({
      houseId: z.string(),
      page: z.number(),
      sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
    }),
    async resolve({ input }) {
      const skip = input.page * 25;

      const [totalCount, items] = await Promise.all([
        prisma.product.count({
          where: { houseId: input.houseId },
        }),
        prisma.product.findMany({
          take: 25,
          skip,
          // orderBy: getOrderByFromInput(input),
          where: { houseId: input.houseId },
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
      expireDate: z.date().optional().nullable(),
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
          expirationDate: input.expireDate?.toString(),
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
      expireDate: z.date().optional().nullable(),
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
          expirationDate: input.expireDate?.toString(),

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

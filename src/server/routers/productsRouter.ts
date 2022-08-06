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
  .query("getProductsByHouseId", {
    input: z.object({
      houseId: z.string(),
      page: z.number(),
      sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
    }),
    async resolve({ input }) {
      const skip = input.page * 25;

      // todo: check if user has access to this house

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
  });

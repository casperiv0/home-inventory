import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { prisma } from "utils/prisma";
import { z } from "zod";

export const housesRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .query("getUserHouses", {
    async resolve({ ctx }) {
      const houses = await prisma.house.findMany({
        where: {
          users: { some: { id: ctx.dbUser!.id } },
        },
        select: {
          name: true,
          id: true,
          currency: true,
          houseRoles: { select: { id: true, role: true, userId: true } },
          users: {
            select: { name: true },
          },
          products: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      return houses;
    },
  })
  .query("getHouseById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const house = await prisma.house.findFirstOrThrow({
        where: { id: input.id, users: { some: { id: ctx.dbUser!.id } } },
      });

      return house;
    },
  })
  .mutation("delete-user", {
    async resolve({ ctx }) {
      if (!ctx.session?.user?.email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await prisma.user.delete({
        where: { email: ctx.session.user.email },
      });

      return { deleted: true };
    },
  });

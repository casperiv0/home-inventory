import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { t } from "server/trpc";
import { prisma } from "utils/prisma";
import { isAuth } from "utils/trpc";
import { z } from "zod";

const housesInclude = {
  houseRoles: { select: { id: true, role: true, userId: true } },
  users: { select: { name: true } },
  products: {
    select: {
      name: true,
      id: true,
    },
  },
};

export const housesRouter = t.router({
  getUserHouses: isAuth.query(async ({ ctx }) => {
    const houses = await prisma.house.findMany({
      where: {
        users: { some: { id: ctx.dbUser!.id } },
      },
      include: housesInclude,
    });

    return houses;
  }),
  getHouseById: isAuth.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const house = await prisma.house.findFirstOrThrow({
      where: { id: input.id, users: { some: { id: ctx.dbUser!.id } } },
      include: housesInclude,
    });

    return house;
  }),
  getHouseStats: isAuth.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const highAmount = new Date();
    const lowAmount = new Date();
    lowAmount.setMonth(highAmount.getMonth() - 1);

    const twoDaysFromNow = new Date(Date.now() + 60 * 60 * 24 * 2 * 1000);

    const house = await prisma.house.findFirstOrThrow({
      where: { id: input.id, users: { some: { id: ctx.dbUser!.id } } },
      include: housesInclude,
    });

    const [productsLast30Days, soonToExpire, lowOnQuantity] = await Promise.all([
      prisma.product.findMany({
        where: { houseId: house.id, createdAt: { gte: lowAmount, lte: highAmount } },
      }),
      prisma.product.findMany({
        where: { houseId: house.id, expirationDate: { lte: twoDaysFromNow } },
      }),
      prisma.product.findMany({
        where: { houseId: house.id, quantity: { lte: 2 } },
      }),
    ]);

    const totalSpentLast30Days = productsLast30Days
      .flatMap((p) => p.prices)
      .reduce((acc, cur) => acc + cur, 0);

    return { totalSpentLast30Days, soonToExpire, lowOnQuantity };
  }),
  addHouse: isAuth.input(z.object({ name: z.string().min(2) })).mutation(async ({ ctx, input }) => {
    const userId = ctx.dbUser!.id;

    const house = await prisma.house.create({
      data: {
        name: input.name,
        ownerId: userId,
        users: { connect: { id: userId } },
        houseRoles: {
          create: {
            role: UserRole.OWNER,
            userId: userId!,
          },
        },
      },
    });

    return house;
  }),
  editHouse: isAuth
    .input(z.object({ id: z.string().min(1), name: z.string().min(2) }))
    .mutation(async ({ ctx, input }) => {
      const house = await prisma.house.findFirst({
        where: { id: input.id, users: { some: { id: ctx.dbUser!.id } } },
      });

      if (!house) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const updatedHouse = await prisma.house.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });

      return updatedHouse;
    }),
  deleteHouse: isAuth
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const house = await prisma.house.findFirst({
        where: { id: input.id, users: { some: { id: ctx.dbUser!.id } } },
      });

      if (!house) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prisma.house.delete({
        where: { id: house.id },
      });

      return true;
    }),
});

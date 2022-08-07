import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { prisma } from "utils/prisma";
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
        include: housesInclude,
      });

      return houses;
    },
  })
  .query("getHouseById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const house = await prisma.house.findFirstOrThrow({
        where: { id: input.id, users: { some: { id: ctx.dbUser!.id } } },
        include: housesInclude,
      });

      return house;
    },
  })
  .mutation("addHouse", {
    input: z.object({
      name: z.string().min(2),
    }),
    async resolve({ ctx, input }) {
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
    },
  })
  .mutation("editHouse", {
    input: z.object({
      id: z.string().min(1),
      name: z.string().min(2),
    }),
    async resolve({ ctx, input }) {
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
    },
  })
  .mutation("deleteHouse", {
    input: z.object({
      id: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
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
    },
  });

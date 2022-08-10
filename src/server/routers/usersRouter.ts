import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { getOrderByFromInput } from "utils/db-utils";
import { isValidHouse } from "utils/isValidHouse";
import { prisma } from "utils/prisma";
import { z } from "zod";

export const usersRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .middleware(isValidHouse)
  .query("getUsersByHouseId", {
    input: z.object({
      houseId: z.string(),
      page: z.number(),
      sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
    }),
    async resolve({ input }) {
      const skip = input.page * 25;

      const [totalCount, items] = await Promise.all([
        prisma.user.count({
          where: { houses: { some: { id: input.houseId } } },
        }),
        prisma.user.findMany({
          take: 25,
          skip,
          orderBy: input.sorting ? getOrderByFromInput(input) : { createdAt: "asc" },
          where: { houses: { some: { id: input.houseId } } },
          include: { houseRoles: true },
        }),
      ]);

      return { maxPages: Math.floor(totalCount / 25), items };
    },
  })
  .mutation("addUser", {
    input: z.object({
      houseId: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.nativeEnum(UserRole),
    }),
    async resolve({ input }) {
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        const updatedUser = await prisma.user.update({
          where: { id: existing.id },
          data: {
            houses: { connect: { id: input.houseId } },
            name: input.name,
            houseRoles: {
              create: {
                houseId: input.houseId,
                role: input.role,
              },
            },
          },
        });

        return updatedUser;
      }

      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          houses: { connect: { id: input.houseId } },
          houseRoles: {
            create: {
              houseId: input.houseId,
              role: input.role,
            },
          },
        },
      });

      return user;
    },
  })
  .mutation("editUser", {
    input: z.object({
      houseId: z.string(),
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.nativeEnum(UserRole),
    }),
    async resolve({ input }) {
      const existing = await prisma.user.findFirst({
        where: { email: input.email, NOT: { id: input.id } },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with that email already exists",
        });
      }

      const houseRole = await prisma.houseRole.findFirst({
        where: { userId: input.id, houseId: input.houseId },
      });

      if (houseRole?.role === UserRole.OWNER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't edit the owner of a house",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: input.id },
        data: {
          email: input.email,
          name: input.name,
          houseRoles: {
            upsert: {
              where: { id: String(houseRole?.id) },
              create: { houseId: input.houseId, role: input.role },
              update: { role: input.role },
            },
          },
        },
      });

      return updatedUser;
    },
  })
  .mutation("deleteUser", {
    input: z.object({
      houseId: z.string(),
      id: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const houseRole = await prisma.houseRole.findFirst({
        where: { userId: input.id, houseId: input.houseId },
      });

      if (houseRole?.role === UserRole.OWNER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't delete the owner of a house",
        });
      }

      await prisma.user.update({
        where: { id: input.id },
        data: { houses: { disconnect: { id: input.houseId } } },
      });

      return true;
    },
  });

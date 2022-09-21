import { TRPCError } from "@trpc/server";
import { t } from "server/trpc";
import { prisma } from "./prisma";

export const isAuth = t.procedure.use(
  t.middleware(({ next, ctx }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  }),
);

export const isInHouse = isAuth.use(
  t.middleware(async ({ next, ctx, rawInput }) => {
    const houseId =
      rawInput &&
      typeof rawInput === "object" &&
      "houseId" in rawInput &&
      (rawInput as Record<string, string>).houseId;

    if (!houseId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Must include `houseId`" });
    }

    const house = await prisma.house.findFirst({
      where: { id: houseId, users: { some: { id: ctx.dbUser!.id } } },
    });

    if (!house) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return next();
  }),
);

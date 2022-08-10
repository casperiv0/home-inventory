import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "./prisma";

interface Options {
  rawInput: unknown;
  next: any;
  ctx: { dbUser?: User | null };
}

export async function isValidHouse({ ctx, next, rawInput }: Options) {
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
}

import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import type { Context } from "server/context";
import { authOptions } from "../pages/api/auth/[...nextauth]";

interface Options {
  req: GetServerSidePropsContext["req"] | NextApiRequest;
  res: GetServerSidePropsContext["res"] | NextApiResponse;
}

export async function getServerSession({ req, res }: Options) {
  return unstable_getServerSession(req, res, authOptions);
}

export function getUserFromSession(ctx: Context): {
  session: Session;
  dbUser: User;
} {
  if (!ctx.session || !ctx.dbUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return ctx as any;
}

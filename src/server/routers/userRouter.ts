import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "server/createRouter";
import { prisma } from "utils/prisma";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  imageUrl: true,
});

export const userRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  })
  .query("getSession", {
    async resolve({ ctx }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: ctx.dbUser!.email },
        select: defaultUserSelect,
      });

      return { session: ctx.session, user: dbUser };
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

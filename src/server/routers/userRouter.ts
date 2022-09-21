import { TRPCError } from "@trpc/server";
import { t } from "server/trpc";
import { prisma } from "utils/prisma";
import { isAuth } from "utils/middlewares";

export const userRouter = t.router({
  getSession: isAuth.query(async ({ ctx }) => {
    const dbUser = await prisma.user.findUnique({
      where: { email: ctx.dbUser!.email },
      include: { houseRoles: true },
    });

    return { session: ctx.session, user: dbUser };
  }),
  deleteUser: isAuth.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await prisma.user.delete({
      where: { email: ctx.session.user.email },
    });

    return { deleted: true };
  }),
});

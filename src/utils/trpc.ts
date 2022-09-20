import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { TRPCError } from "@trpc/server";
import { t } from "server/trpc";
import { httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "server/routers/_app";
import { prisma } from "./prisma";

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
          "accept-language": ctx?.req?.headers["accept-language"],
          ssr: "true",
        };
      },
      url: getBaseUrl(),
      fetch(url: RequestInfo | URL, options?: RequestInit | undefined) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: true,
});

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_PROD_URL) {
    return process.env.NEXT_PUBLIC_PROD_URL;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

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

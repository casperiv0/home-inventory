import { createRouter } from "../createRouter";
import superjson from "superjson";
import { userRouter } from "./userRouter";
import { housesRouter } from "./housesRouter";
import { productsRouter } from "./productsRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("houses.", housesRouter)
  .merge("products.", productsRouter);

export type AppRouter = typeof appRouter;

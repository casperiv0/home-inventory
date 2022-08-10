import { createRouter } from "../createRouter";
import superjson from "superjson";
import { userRouter } from "./userRouter";
import { housesRouter } from "./housesRouter";
import { productsRouter } from "./productsRouter";
import { categoriesRouter } from "./categoriesRouter";
import { usersRouter } from "./usersRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("houses.", housesRouter)
  .merge("products.", productsRouter)
  .merge("categories.", categoriesRouter)
  .merge("users.", usersRouter);

export type AppRouter = typeof appRouter;

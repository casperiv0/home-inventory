import { t } from "../trpc";
import { userRouter } from "./userRouter";
import { housesRouter } from "./housesRouter";
import { productsRouter } from "./productsRouter";
import { categoriesRouter } from "./categoriesRouter";
import { usersRouter } from "./usersRouter";

export const appRouter = t.router({
  user: userRouter,
  houses: housesRouter,
  products: productsRouter,
  categories: categoriesRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

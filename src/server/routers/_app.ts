import { createRouter } from "../createRouter";
import superjson from "superjson";
import { userRouter } from "./userRouter";
import { housesRouter } from "./housesRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("houses.", housesRouter);

export type AppRouter = typeof appRouter;

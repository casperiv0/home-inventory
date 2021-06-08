import { Router } from "express";
import authRouter from "./auth";

const router = Router();

router.use("/auth", authRouter);

router.post("/", (_, res) => {
  return res.json({
    message: "Hello world",
  });
});

export default router;

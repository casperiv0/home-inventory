import { Router } from "express";
import { authRouter } from "./auth";
import { productsRouter } from "./products";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productsRouter);

router.post("/", (_, res) => {
  return res.json({
    message: "Hello world",
  });
});

export default router;

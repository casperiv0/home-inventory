import { Router } from "express";
import { withAuth } from "@hooks/withAuth";
import { createProductSchema } from "@schemas/products.schema";
import { IRequest } from "@t/IRequest";
import { createYupSchema } from "@utils/createYupSchema";
import { prisma } from "src/index";

const router = Router();

/**
 * return all the projects inside the database
 */
router.get("/", withAuth, async (_, res) => {
  const products = await prisma.product.findMany();

  return res.json({ products });
});

/**
 * create a new product
 */
router.post("/", withAuth, async (req: IRequest, res) => {
  const body = req.body;

  const schema = createYupSchema(createProductSchema);
  const error = await schema
    .validate(body)
    .then(() => null)
    .catch((e) => e);

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const existing = await prisma.product.findUnique({ where: { name: body.name } });

  if (existing) {
    return res.status(400).json({
      error: "Name is already in-use, please update the existing item",
      status: "error",
    });
  }

  const product = await prisma.user.update({
    where: {
      id: req.userId!,
    },
    data: {
      products: {
        create: {
          name: body.name,
          quantity: body.quantity,
          price: body.price,
          expirationDate: body.expirationDate || "N/A",
        },
      },
    },
    include: {
      products: true,
    },
  });

  return res.json({ product });
});

export const productsRouter = router;

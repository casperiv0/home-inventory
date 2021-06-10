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

router.get("/:id", withAuth, async (req, res) => {
  const id = req.params.id as string;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return res.status(404).json({
      error: "Product was not found",
      status: "error",
    });
  }

  return res.json({ product });
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

  let category;
  if (body.categoryId) {
    category = await prisma.category.findUnique({
      where: { id: body.categoryId },
    });

    if (!category) {
      return res.status(404).json({
        error: "That category was not found",
        status: "error",
      });
    }
  }

  await prisma.user.update({
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
          categoryId: category?.id ?? null,
        },
      },
    },
  });

  const products = await prisma.product.findMany();

  return res.json({ products });
});

router.put("/:id", withAuth, async (req, res) => {
  const id = req.params.id as string;
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

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return res.status(404).json({
      error: "Product was not found",
      status: "error",
    });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      quantity: body.quantity,
      price: body.price,
      expirationDate: body.expirationDate || "N/A",
    },
  });

  return res.json({ product: updated });
});

router.delete("/:id", withAuth, async (req, res) => {
  const id = req.params.id as string;

  const product = await prisma.product.delete({ where: { id } });

  return res.json({ deleted: !!product });
});

export const productsRouter = router;

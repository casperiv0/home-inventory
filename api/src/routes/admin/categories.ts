import { Router } from "express";
import { withAuth } from "@hooks/withAuth";
import { withPermission } from "@hooks/withPermission";
import { prisma } from "src/index";
import { validateSchema } from "@utils/validateSchema";
import { categorySchema } from "@schemas/category.schema";

const router = Router();

router.post("/", withAuth, withPermission("ADMIN"), async (req, res) => {
  try {
    const body = req.body;

    const [error] = await validateSchema(categorySchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }

    const existing = await prisma.category.findUnique({ where: { name: body.name } });

    if (existing) {
      return res.status(400).json({
        error: "A category with that name already exists.",
        status: "error",
      });
    }

    await prisma.category.create({
      data: {
        name: body.name.toLowerCase(),
      },
    });

    const categories = await prisma.category.findMany();

    return res.json({ categories });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.get("/", withAuth, async (_, res) => {
  const categories = await prisma.category.findMany();

  return res.json({ categories });
});

router.put("/:id", withAuth, withPermission("ADMIN"), async (req, res) => {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const [error] = await validateSchema(categorySchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({
        error: "Category was not found",
        status: "error",
      });
    }

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: body.name,
      },
    });

    const categories = await prisma.category.findMany();

    return res.json({ categories });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.delete("/:id", withAuth, withPermission("ADMIN"), async (req, res) => {
  try {
    const id = req.params.id as string;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(400).json({
        error: "Category was not found",
        status: "error",
      });
    }

    await prisma.category.delete({ where: { id } });

    const categories = await prisma.category.findMany();

    return res.json({ categories });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

export const categoriesRouter = router;

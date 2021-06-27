import { Router } from "express";
import { withAuth } from "@hooks/withAuth";
import { prisma } from "@lib/prisma";
import { withValidHouseId } from "@hooks/withValidHouseId";

const router = Router();

/**
 * return products found by the category name.
 */
router.get("/:houseId/:name", withAuth, withValidHouseId, async (req, res) => {
  try {
    const categoryName = req.params.name as string;
    const houseId = req.params.houseId as string;

    const category = await prisma.category.findFirst({
      where: {
        houseId,
        name: categoryName,
      },
    });

    if (!category) {
      return res.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        houseId,
      },
    });

    return res.json({ products });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

export const categoryRouter = router;

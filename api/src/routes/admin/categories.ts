import { Router } from "express";
import { withAuth } from "@hooks/withAuth";
import { withPermission } from "@hooks/withPermission";
import { prisma } from "src/index";
import { validateSchema } from "@utils/validateSchema";
import { categorySchema } from "@schemas/category.schema";
import { withValidHouseId } from "@hooks/withValidHouseId";

const router = Router();

async function getCategories(houseId: string | undefined) {
  return prisma.category.findMany({ where: { houseId } });
}

router.post(
  "/:houseId",
  withAuth,
  withValidHouseId,
  withPermission("ADMIN"),
  async (req, res) => {
    try {
      const houseId = req.params.houseId as string;
      const body = req.body;

      const [error] = await validateSchema(categorySchema, body);

      if (error) {
        return res.status(400).json({
          error: error.message,
          status: "error",
        });
      }

      const existing = await prisma.category.findFirst({
        where: { name: body.name, houseId },
      });

      if (existing) {
        return res.status(400).json({
          error: "A category with that name already exists.",
          status: "error",
        });
      }

      await prisma.house.update({
        where: {
          id: houseId,
        },
        data: {
          categories: {
            create: {
              name: body.name.toLowerCase(),
            },
          },
        },
      });

      const categories = await getCategories(req.params.houseId);
      return res.json({ categories });
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        error: "An unexpected error has occurred. Please try again later",
        status: "error",
      });
    }
  }
);

router.get("/:houseId", withAuth, withValidHouseId, async (req, res) => {
  const categories = await getCategories(req.params.houseId);
  return res.json({ categories });
});

router.put(
  "/:houseId/:id",
  withAuth,
  withValidHouseId,
  withPermission("ADMIN"),
  async (req, res) => {
    try {
      const id = req.params.id as string;
      const houseId = req.params.houseId as string;
      const body = req.body;

      const [error] = await validateSchema(categorySchema, body);

      if (error) {
        return res.status(400).json({
          error: error.message,
          status: "error",
        });
      }

      const category = await prisma.category.findFirst({
        where: { id, houseId },
      });

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

      const categories = await getCategories(req.params.houseId);
      return res.json({ categories });
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        error: "An unexpected error has occurred. Please try again later",
        status: "error",
      });
    }
  }
);

router.delete(
  "/:houseId/:id",
  withAuth,
  withValidHouseId,
  withPermission("ADMIN"),
  async (req, res) => {
    try {
      const id = req.params.id as string;
      const houseId = req.params.houseId as string;

      const category = await prisma.category.findFirst({
        where: { id, houseId },
      });

      if (!category) {
        return res.status(400).json({
          error: "Category was not found",
          status: "error",
        });
      }

      await prisma.category.delete({ where: { id } });

      const categories = await getCategories(req.params.houseId);
      return res.json({ categories });
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        error: "An unexpected error has occurred. Please try again later",
        status: "error",
      });
    }
  }
);

export const categoriesRouter = router;

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { validateSchema } from "@casper124578/utils";
import { withAuth } from "@hooks/withAuth";
import { createProductSchema } from "@schemas/products.schema";
import { IRequest } from "@t/IRequest";
import { prisma } from "@lib/prisma";
import { withValidHouseId } from "@hooks/withValidHouseId";
import { getProducts } from "./products";
import { Category, Product } from "@prisma/client";
import { importCategorySchema } from "@schemas/category.schema";
import { getCategories } from "./admin/categories";

const router = Router();

router.post("/:houseId", withAuth, withValidHouseId, async (req: IRequest, res: Response) => {
  const files = req.files;
  const houseId = req.params.houseId as string;

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).send({ error: "Please upload a valid file" });
  }

  /**
   * the file that was uploaded
   */
  const file = files.file as UploadedFile | null;

  if (file?.mimetype !== "application/json") {
    return res.status(400).json({ error: "invalid file type" });
  }

  /**
   * the raw data of the file
   */
  const rawData = file.data.toString("utf8");

  let data;
  const productsArr = [];
  const categoriesArr = [];

  try {
    data = JSON.parse(rawData);
  } catch {
    data = null;
  }

  const products = data?.products as Product | Product[] | null;
  const categories = data?.categories as Category[] | null;

  if (!products || !categories || !Array.isArray(categories)) {
    return res.status(400).json({
      error: "invalid data received",
      status: "error",
    });
  }

  if (Array.isArray(products)) {
    /**
     * check for any errors
     */
    const errors = await Promise.all(
      products.map(async (obj) => {
        const [error] = await validateSchema(createProductSchema, obj);

        return error ?? null;
      }),
    );

    /**
     * only return the error messages instead of the entire error
     */
    const mappedErrors = errors.filter(Boolean).map((v) => v?.message);
    if (mappedErrors.length > 0) {
      return res.status(400).json({ error: mappedErrors.join(", ") });
    }

    productsArr.push(...products);
  } else if (typeof products === "object") {
    const [error] = await validateSchema(createProductSchema, products);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    productsArr.push(products);
  } else {
    return res.status(400).json({
      error: "invalid data received",
    });
  }

  const errors = await Promise.all(
    categories.map(async (obj) => {
      const [error] = await validateSchema(importCategorySchema, obj);

      return error ?? null;
    }),
  );

  /**
   * only return the error messages instead of the entire error
   */
  const mappedErrors = errors.filter(Boolean).map((v) => v?.message);
  if (mappedErrors.length > 0) {
    return res.status(400).json({ error: mappedErrors.join(", ") });
  }

  categoriesArr.push(...categories);

  await Promise.all([
    ...productsArr.map(async (v) => {
      const existing = await prisma.product.findFirst({
        where: { name: v.name, houseId },
      });

      if (existing) {
        await prisma.product.update({
          where: {
            id: existing.id,
          },
          data: {
            quantity: existing.quantity + v.quantity,
            prices: [...(existing.prices ?? []), v.price * v.quantity],
          },
        });
      } else {
        await prisma.product.create({
          data: {
            name: v.name,
            price: v.price,
            quantity: v.quantity,
            prices: [v.price * v.quantity],
            categoryId: v.categoryId ?? null,
            expirationDate: v.expirationDate ?? null,
            warnOnQuantity: v.warnOnQuantity ?? undefined,
            ignoreQuantityWarning: v.ignoreQuantityWarning ?? false,
            userId: req.userId!,
            houseId,
            createdAt: v.createdAt ? new Date(v.createdAt) : undefined,
          },
        });
      }
    }),
    ...categoriesArr.map(async (v) => {
      const existing = await prisma.category.findFirst({
        where: { id: v.id, houseId },
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            id: v.id,
            name: v.name,
            houseId,
          },
        });
      }
    }),
  ]);

  const items = await getProducts(req.params.houseId);
  const catItems = await getCategories(req.params.houseId);
  return res.json({ products: items, categories: catItems });
});

export const importRouter = router;

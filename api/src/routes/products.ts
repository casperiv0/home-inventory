import { Response, Router } from "express";
import isThisMonth from "date-fns/isThisMonth";
import { validateSchema } from "@casper124578/utils";
import { UploadedFile } from "express-fileupload";
import { withAuth } from "@hooks/withAuth";
import { createProductSchema } from "@schemas/products.schema";
import { IRequest } from "@t/IRequest";
import { prisma } from "src/index";
import { withValidHouseId } from "@hooks/withValidHouseId";

const router = Router();

async function getProducts(houseId: string | undefined) {
  return prisma.product.findMany({ where: { houseId } });
}

/**
 * return all the projects from the houseId
 */
router.get("/:houseId", withAuth, withValidHouseId, async (req, res) => {
  const products = await getProducts(req.params.houseId);

  return res.json({ products });
});

router.get("/:houseId/stats", withAuth, withValidHouseId, async (req, res) => {
  try {
    const products = await getProducts(req.params.houseId);

    /**
     * the total amount spent this month
     */
    const totalSpent = products
      .filter((v) => {
        return isThisMonth(new Date(v.createdAt));
      })
      .flatMap((v) => v.prices)
      ?.reduce((ac, curr) => ac + curr, 0)
      .toFixed(0);

    /**
     * products that are low on quantity will be shown on the dashboard
     */
    const lowOnQuantity = products.filter((v) => {
      return v.quantity <= v.warnOnQuantity && !v.ignoreQuantityWarning;
    });

    const soonToExpire = products.filter((v) => {
      if (!v.expirationDate || v.expirationDate === "N/A") return false;

      const expirationDate = new Date(v.expirationDate).getTime();
      const twoDaysFromNow = Date.now() + 60 * 60 * 24 * 2 * 1000;

      /**
       * if the product will expire within 2 days from today
       * show it on the dashboard
       */
      return expirationDate <= twoDaysFromNow;
    });

    return res.json({
      totalSpent,
      soonToExpire,
      lowOnQuantity,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.get("/:houseId/:id", withAuth, withValidHouseId, async (req, res) => {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({
        error: "Product was not found",
        status: "error",
      });
    }

    return res.json({ product });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

/**
 * create a new product
 */
router.post("/:houseId", withAuth, withValidHouseId, async (req: IRequest, res) => {
  try {
    const houseId = req.params.houseId as string;
    const body = req.body;

    const [error] = await validateSchema(createProductSchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }

    const existing = await prisma.product.findFirst({
      where: { name: body.name, houseId },
    });

    /**
     * if there's already a product with the same name,
     * update the existing product with the new quantity
     * and append to price to the prices array
     */
    if (existing) {
      await prisma.product.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + body.quantity,

          // body.price = for 1 item, times the quantity -> total amount for the product.
          prices: [...(existing.prices ?? []), body.price * body.quantity],
        },
      });

      const products = await getProducts(req.params.houseId);
      return res.json({ products });
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

    await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        quantity: body.quantity,
        prices: [body.price * body.quantity],
        categoryId: category?.id ?? null,
        expirationDate: body.expirationDate ?? null,
        warnOnQuantity: body.warnOnQuantity ?? undefined,
        ignoreQuantityWarning: body.ignoreQuantityWarning ?? false,
        userId: req.userId!,
        houseId,
        createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
      },
    });

    const products = await getProducts(req.params.houseId);
    return res.json({ products });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.post(
  "/:houseId/import",
  withAuth,
  withValidHouseId,
  async (req: IRequest, res: Response) => {
    const files = req.files;
    const houseId = req.params.houseId as string;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send({ error: "Please upload a valid file" });
    }

    /**
     * the file that was uploaded
     */
    const file = files.file as UploadedFile;

    if (file.mimetype !== "application/json") {
      return res.status(400).json({ error: "invalid file type" });
    }

    /**
     * the raw data of the file
     */
    const rawData = file?.data?.toString("utf8");

    let data;
    const array = [];

    try {
      data = JSON.parse(rawData);
    } catch {
      data = null;
    }

    if (Array.isArray(data)) {
      /**
       * check for any errors
       */
      const errors = await Promise.all(
        data.map(async (obj) => {
          const [error] = await validateSchema(createProductSchema, obj);

          return error ?? null;
        }),
      );

      /**
       * only return the error messages instead of the entire error
       */
      const filteredErrors = errors.filter(Boolean).map((v) => v?.message);
      if (filteredErrors.length > 0) {
        return res.status(400).json({ error: filteredErrors.join(", ") });
      }

      array.push(...data);
    } else if (typeof data === "object") {
      const [error] = await validateSchema(createProductSchema, data);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      array.push(data);
    } else {
      return res.status(400).json({
        error: "invalid data received",
      });
    }

    await Promise.all(
      array.map(async (v) => {
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
    );

    const products = await getProducts(req.params.houseId);
    return res.json({ products });
  },
);

router.put("/:houseId/:id", withAuth, withValidHouseId, async (req, res) => {
  try {
    const id = req.params.id as string;
    const houseId = req.params.houseId as string;
    const body = req.body;

    const [error] = await validateSchema(createProductSchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        houseId,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product was not found",
        status: "error",
      });
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        quantity: body.quantity,
        price: body.price,
        expirationDate: body.expirationDate ?? null,
        warnOnQuantity: body.warnOnQuantity ?? 2,
        ignoreQuantityWarning: body.ignoreQuantityWarning ?? false,

        // body.price = for 1 item, times the quantity -> total amount for the product.
        prices: [body.price * body.quantity],
        categoryId: body.categoryId ?? null,
      },
    });

    const products = await getProducts(req.params.houseId);
    return res.json({ products });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.delete("/:houseId/:id", withAuth, withValidHouseId, async (req, res) => {
  try {
    const id = req.params.id as string;
    const houseId = req.params.houseId as string;

    const product = await prisma.product.findFirst({
      where: {
        id,
        houseId,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product was not found",
        status: "error",
      });
    }

    await prisma.product.delete({ where: { id } });

    const products = await getProducts(req.params.houseId);
    return res.json({ products });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

export const productsRouter = router;

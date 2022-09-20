import { t } from "server/trpc";
import { createPrismaWhereFromFilters, getOrderByFromInput } from "utils/db-utils";
import { prisma } from "utils/prisma";
import { isInHouse } from "utils/trpc";
import { z } from "zod";

export const TABLE_FILTER = z.object({
  name: z.string(),
  filterType: z.enum(["string", "date", "number", "enum"]),
  content: z.string().or(z.number()).optional(),
  type: z.enum(["equals", "contains", "lt", "gt"]).optional(),
  options: z.array(z.string()).optional(),
});

const ADD_PRODUCT_SCHEMA = z.object({
  houseId: z.string(),
  name: z.string().min(2),
  price: z
    .any()
    .refine((arg) => ([null, undefined, "", "0", 0].includes(arg) ? "null" : parseInt(arg, 10)))
    .nullable(),
  quantity: z.number().min(1),
  categoryId: z.string().nullable().optional(),
  expireDate: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  ignoreQuantityWarning: z.boolean().optional().nullable(),
  description: z.string().nullable().optional(),
});

const EDIT_PRODUCT_SCHEMA = ADD_PRODUCT_SCHEMA.extend({
  id: z.string().min(1),
});

export const productsRouter = t.router({
  getProductsByHouseId: isInHouse
    .input(
      z.object({
        houseId: z.string(),
        page: z.number(),
        sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
        filters: z.array(TABLE_FILTER).optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = input.page * 25;

      const [totalCount, items] = await Promise.all([
        prisma.product.count({
          where: { houseId: input.houseId, ...createPrismaWhereFromFilters(input.filters) },
        }),
        prisma.product.findMany({
          take: 25,
          skip,
          orderBy: input.sorting ? getOrderByFromInput(input) : { createdAt: "asc" },
          where: { houseId: input.houseId, ...createPrismaWhereFromFilters(input.filters) },
          include: { category: true, createdBy: true },
        }),
      ]);

      return { maxPages: Math.floor(totalCount / 25), items };
    }),
  getAllProducts: isInHouse.input(z.object({ houseId: z.string() })).query(async ({ input }) => {
    const products = await prisma.product.findMany({
      where: { houseId: input.houseId },
      include: { category: true, createdBy: true },
    });

    return products;
  }),
  addProduct: isInHouse.input(ADD_PRODUCT_SCHEMA).mutation(async ({ ctx, input }) => {
    const existing = await prisma.product.findFirst({
      where: { name: input.name, houseId: input.houseId },
    });

    /**
     * if there's already a product with the same name,
     * update the existing product with the new quantity
     * and append to price to the prices array
     */
    if (existing) {
      const updatedProduct = await prisma.product.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + input.quantity,

          // input.price = for 1 item, times the quantity -> total amount for the product.
          prices: [...existing.prices, input.price * input.quantity],
        },
      });

      return updatedProduct;
    }

    const product = await prisma.product.create({
      data: {
        name: input.name,
        price: input.price,
        quantity: input.quantity,
        houseId: input.houseId,
        userId: ctx.dbUser!.id,
        expirationDate: input.expireDate ? new Date(input.expireDate) : undefined,
        createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
        categoryId: input.categoryId || null,
        prices: [input.price * input.quantity],
        ignoreQuantityWarning: input.ignoreQuantityWarning ?? false,
        description: input.description,
      },
    });

    return product;
  }),
  editProduct: isInHouse.input(EDIT_PRODUCT_SCHEMA).mutation(async ({ input }) => {
    const product = await prisma.product.findFirstOrThrow({
      where: { id: input.id, houseId: input.houseId },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: input.name,
        quantity: input.quantity,
        price: input.price,
        expirationDate: input.expireDate ? new Date(input.expireDate) : undefined,
        categoryId: input.categoryId || null,
        createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
        ignoreQuantityWarning: input.ignoreQuantityWarning ?? false,
        description: input.description,

        // input.price = for 1 item, times the quantity -> total amount for the product.
        prices: [input.price * input.quantity],
      },
    });

    return updatedProduct;
  }),
  importProductsFromFile: isInHouse
    .input(z.object({ houseId: z.string(), file: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const json = JSON.parse(input.file);
      const arraySchema = z.object({
        products: z.array(ADD_PRODUCT_SCHEMA.omit({ houseId: true })),
        categories: z.array(z.object({ id: z.string().nullable().optional(), name: z.string() })),
      });

      const data = await arraySchema.parseAsync(json);

      await prisma.$transaction([
        ...data.categories.map((category) =>
          prisma.category.create({
            data: { id: category.id ?? undefined, name: category.name, houseId: input.houseId },
          }),
        ),
        ...data.products.map((product) => {
          const createUpdateData = {
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            houseId: input.houseId,
            userId: ctx.dbUser!.id,
            expirationDate: product.expireDate ? new Date(product.expireDate) : undefined,
            createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
            categoryId: product.categoryId || null,
            prices: [product.price * product.quantity],
            ignoreQuantityWarning: product.ignoreQuantityWarning ?? false,
            description: product.description,
          };

          return prisma.product.upsert({
            where: { name_houseId: { houseId: input.houseId, name: product.name } },
            create: createUpdateData,
            update: createUpdateData,
            include: { createdBy: true, category: true },
          });
        }),
      ]);
    }),
  deleteProduct: isInHouse
    .input(
      z.object({
        id: z.string().min(1),
        houseId: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const product = await prisma.product.findFirstOrThrow({
        where: { id: input.id, houseId: input.houseId },
      });

      await prisma.product.delete({
        where: { id: product.id },
      });

      return true;
    }),
});

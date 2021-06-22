import { Product } from "@t/Product";

/**
 * @todo
 */
export function importHandler(data: Product[]): Partial<Product>[] {
  return data.map((value) => {
    return {
      name: value.name,
      price: value.price,
      categoryId: value.categoryId,
      quantity: value.quantity,
      expirationDate: value.expirationDate,
      createdAt: value.createdAt,
      ignoreQuantityWarning: value.ignoreQuantityWarning,
      userId: value.userId,
      warnOnQuantity: value.warnOnQuantity,
    };
  });
}

import type { Category } from "@t/Category";
import type { Product } from "@t/Product";

export function parseExport(products: Product[], categories: Category[]) {
  return {
    products: products.map((p: Partial<Product>) => {
      delete p.id;
      delete p.houseId;
      delete p.userId;

      return p;
    }),
    categories: categories.map((c: Partial<Category>) => {
      delete c.houseId;

      return c;
    }),
  };
}

import { Product } from "@t/Product";

export function parseExport(products: Product[]) {
  return products.map((p: Partial<Product>) => {
    delete p.id;
    delete p.houseId;
    delete p.userId;

    return p;
  });
}

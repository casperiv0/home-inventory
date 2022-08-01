import type { Product } from "./Product";

export interface Statistics {
  totalSpent: string;

  soonToExpire: Product[];
  lowOnQuantity: Product[];
}

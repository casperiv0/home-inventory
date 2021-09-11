import { Product } from "./Product";

export interface ShoppingList {
  id: string;
  products: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  product: Product;
  completed: boolean;
}

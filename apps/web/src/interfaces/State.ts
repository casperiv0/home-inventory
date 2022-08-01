import type { Category } from "./Category";
import type { User } from "./User";
import type { Product } from "./Product";
import type { Statistics } from "./Statistics";
import type { House } from "./House";
import type { States } from "src/store/types";
import type { ShoppingList } from "./ShoppingList";

export interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user: User | null;
  };
  admin: {
    users: User[];
    categories: Category[];
  };
  products: {
    products: Product[];
    stats: Statistics | null;
  };
  houses: {
    house: House | null;
    houses: House[];
    state: States;
  };
  shoppingList: {
    shoppingList: ShoppingList | null;
  };
}

import { Category } from "./Category";
import { User } from "./User";
import { Product } from "./Product";
import { Statistics } from "./Statistics";
import { House } from "./House";
import { States } from "src/store/types";

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
}

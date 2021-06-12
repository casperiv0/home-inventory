import { Category } from "@t/Category";
import { House } from "@t/House";
import { Product } from "@t/Product";
import { Statistics } from "@t/Statistics";
import { User } from "@t/User";

export interface SetAuthLoading {
  type: "SET_AUTH_LOADING";
  loading: boolean;
}

export interface Authenticate {
  type: "AUTHENTICATE";
  isAuth: boolean;
  user: User | null;
}

export interface UpdateUsers {
  type: "GET_ALL_USERS" | "UPDATE_USER_BY_ID" | "ADD_USER" | "DELETE_USER_BY_ID";
  users: User[];
}

export interface UpdateCategories {
  type: "GET_ALL_CATEGORIES" | "UPDATE_CATEGORY_BY_ID" | "ADD_CATEGORY" | "DELETE_CATEGORY_BY_ID";
  categories: Category[];
}

export interface UpdateProducts {
  type:
    | "GET_ALL_PRODUCTS"
    | "UPDATE_PRODUCT_BY_ID"
    | "ADD_PRODUCT"
    | "DELETE_PRODUCT_BY_ID"
    | "GET_PRODUCTS_BY_CATEGORY";
  products: Product[];
}

export interface GetStats {
  type: "GET_STATS";
  stats: Statistics;
}

export interface UpdateHouses {
  type: "GET_ALL_HOUSES" | "UPDATE_HOUSE_BY_ID" | "ADD_HOUSE" | "DELETE_HOUSE_BY_ID";
  houses: House[];
}

export interface GetHouseById {
  type: "GET_HOUSE_BY_ID";
  house: House;
}

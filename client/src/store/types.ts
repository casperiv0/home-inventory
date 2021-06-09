import { Category } from "@t/Category";
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

import { User } from "@t/User";

export interface SetAuthLoading {
  type: "SET_AUTH_LOADING";
  loading: boolean;
}

export interface Authenticate {
  type: "AUTHENTICATE";
  isAuth: boolean;
  user: User;
}

export interface UpdateUsers {
  type: "GET_ALL_USERS" | "UPDATE_USER_BY_ID" | "ADD_USER" | "DELETE_USER_BY_ID";
  users: User[];
}

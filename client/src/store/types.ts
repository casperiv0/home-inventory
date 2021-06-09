import { User } from "@t/User";

export interface Authenticate {
  type: "AUTHENTICATE";
  isAuth: boolean;
  user: User;
}

export interface GetAllUsers {
  type: "GET_ALL_USERS";
  users: User[];
}

export interface UpdateUserById {
  type: "UPDATE_USER_BY_ID";
}

import { User } from "@t/User";

export interface Authenticate {
  type: "AUTHENTICATE";
  isAuth: boolean;
  user: User;
}

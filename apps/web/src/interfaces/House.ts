import type { Product } from "./Product";
import type { User } from "./User";

export interface House {
  id: string;
  name: string;
  userId: string;
  currency: string;

  users?: User[];
  products?: Product[];
  houseRoles?: User["houseRoles"];
}

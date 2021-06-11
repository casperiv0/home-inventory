import { Product } from "./Product";
import { User } from "./User";

export interface House {
  id: string;
  name: string;
  userId: string;

  users?: User[];
  products?: Product[];
}

import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import { State } from "@t/State";
import AdminReducer from "./AdminReducer";
import ProductReducer from "./ProductReducer";
import HousesReducer from "./HousesReducer";

export default combineReducers<State>({
  auth: AuthReducer,
  admin: AdminReducer,
  products: ProductReducer,
  houses: HousesReducer,
});

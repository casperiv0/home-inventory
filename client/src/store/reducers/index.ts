import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import { State } from "@t/State";

export default combineReducers<State>({
  auth: AuthReducer,
});

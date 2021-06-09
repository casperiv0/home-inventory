import { State } from "@t/State";
import { GetAllUsers, UpdateUserById } from "../types";

type Actions = GetAllUsers | UpdateUserById;

const initState: State["admin"] = {
  users: [],
};

export default function AdminReducer(state = initState, action: Actions): State["admin"] {
  switch (action.type) {
    case "GET_ALL_USERS": {
      return {
        ...state,
        users: action.users,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

import { State } from "@t/State";
import { UpdateUsers } from "../types";

type Actions = UpdateUsers;

const initState: State["admin"] = {
  users: [],
};

export default function AdminReducer(state = initState, action: Actions): State["admin"] {
  switch (action.type) {
    case "ADD_USER":
    case "DELETE_USER_BY_ID":
    case "UPDATE_USER_BY_ID":
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

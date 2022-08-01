import type { State } from "@t/State";
import type { UpdateCategories, UpdateUsers } from "../types";

type Actions = UpdateUsers | UpdateCategories;

const initState: State["admin"] = {
  users: [],
  categories: [],
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

    case "GET_ALL_CATEGORIES":
    case "DELETE_CATEGORY_BY_ID":
    case "UPDATE_CATEGORY_BY_ID":
    case "IMPORT_CATEGORIES":
    case "ADD_CATEGORY": {
      return {
        ...state,
        categories: action.categories,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}

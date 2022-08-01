import { State } from "@t/State";
import { UpdateShoppingList } from "../types";

type Actions = UpdateShoppingList;

const initState: State["shoppingList"] = {
  shoppingList: null,
};

export default function ShoppingListReducer(
  state = initState,
  action: Actions,
): State["shoppingList"] {
  switch (action.type) {
    case "GET_SHOPPING_LIST":
    case "UPDATE_SHOPPING_LIST": {
      return {
        ...state,
        shoppingList: action.shoppingList,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

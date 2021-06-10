import { State } from "@t/State";
import { UpdateProducts } from "../types";

type Actions = UpdateProducts;

const initState: State["products"] = {
  products: [],
};

export default function ProductReducer(state = initState, action: Actions): State["products"] {
  switch (action.type) {
    case "ADD_PRODUCT":
    case "DELETE_PRODUCT_BY_ID":
    case "GET_ALL_PRODUCTS":
    case "UPDATE_PRODUCT_BY_ID": {
      return {
        ...state,
        products: action.products,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

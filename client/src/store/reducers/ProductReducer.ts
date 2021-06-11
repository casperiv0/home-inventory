import { State } from "@t/State";
import { GetStats, UpdateProducts } from "../types";

type Actions = UpdateProducts | GetStats;

const initState: State["products"] = {
  products: [],
  stats: null,
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

    case "GET_STATS": {
      return {
        ...state,
        stats: action.stats,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}

import { State } from "@t/State";
import { UpdateHouses } from "../types";

type Actions = UpdateHouses;

const initState: State["houses"] = {
  houses: [],
};

export default function HousesReducer(state = initState, action: Actions): State["houses"] {
  switch (action.type) {
    case "GET_ALL_HOUSES":
    case "ADD_HOUSE":
    case "UPDATE_HOUSE_BY_ID":
    case "DELETE_HOUSE_BY_ID": {
      return {
        ...state,
        houses: action.houses,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}

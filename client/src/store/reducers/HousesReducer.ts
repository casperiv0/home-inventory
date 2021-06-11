import { State } from "@t/State";
import { GetHouseById, UpdateHouses } from "../types";

type Actions = UpdateHouses | GetHouseById;

const initState: State["houses"] = {
  houses: [],
  house: null,
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

    case "GET_HOUSE_BY_ID": {
      return {
        ...state,
        house: action.house,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}

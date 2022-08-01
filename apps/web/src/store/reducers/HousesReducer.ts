import type { State } from "@t/State";
import type { GetHouseById, SetState, UpdateHouses } from "../types";

type Actions = UpdateHouses | GetHouseById | SetState;

const initState: State["houses"] = {
  houses: [],
  house: null,
  state: "DONE",
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
        state: "DONE",
      };
    }

    case "GET_HOUSE_BY_ID": {
      return {
        ...state,
        house: action.house,
      };
    }

    case "SET_STATE": {
      return { ...state, ...action };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}

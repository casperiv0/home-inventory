import { State } from "@t/State";
import { Authenticate } from "../types";

type Actions = Authenticate;

const initState: State["auth"] = {
  isAuth: false,
  user: null,
};

export default function AuthReducer(state = initState, action: Actions): State["auth"] {
  switch (action.type) {
    case "AUTHENTICATE": {
      return {
        ...state,
        user: action.user,
        isAuth: action.isAuth,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

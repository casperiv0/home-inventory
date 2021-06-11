import { handleRequest } from "@lib/fetch";
import { Dispatch } from "react";
import { UpdateHouses } from "../types";

export const getHouses = (cookie?: string) => async (dispatch: Dispatch<UpdateHouses>) => {
  try {
    const res = await handleRequest("/houses", "GET", { cookie });

    dispatch({
      type: "GET_ALL_HOUSES",
      houses: res.data.houses,
    });

    return true;
  } catch (e) {
    return false;
  }
};

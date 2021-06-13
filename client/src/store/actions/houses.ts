import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { Dispatch } from "react";
import { toast } from "react-toastify";
import { GetHouseById, SetState, UpdateHouses } from "../types";

export const getHouses =
  (cookie?: string) => async (dispatch: Dispatch<UpdateHouses | SetState>) => {
    dispatch({ type: "SET_STATE", state: "LOADING" });

    try {
      const res = await handleRequest("/houses", "GET", { cookie });

      dispatch({
        type: "GET_ALL_HOUSES",
        houses: res.data.houses,
      });

      return true;
    } catch (e) {
      dispatch({ type: "SET_STATE", state: "ERROR" });
      return false;
    }
  };

export const getCurrentHouse =
  (houseId: string, cookie?: string) => async (dispatch: Dispatch<GetHouseById | SetState>) => {
    dispatch({ type: "SET_STATE", state: "LOADING" });

    try {
      const res = await handleRequest(`/houses/${houseId}`, "GET", { cookie });

      dispatch({
        type: "GET_HOUSE_BY_ID",
        house: res.data.house,
      });

      return true;
    } catch (e) {
      dispatch({ type: "SET_STATE", state: "ERROR", code: 404 });
      return false;
    }
  };

export const addHouse = (data: RequestData) => async (dispatch: Dispatch<UpdateHouses>) => {
  try {
    const res = await handleRequest("/houses", "POST", data);

    dispatch({
      type: "ADD_HOUSE",
      houses: res.data.houses,
    });

    return true;
  } catch (e) {
    toast.error(getErrorFromResponse(e));
    return false;
  }
};

export const updateHouseById =
  (id: string, data: RequestData) => async (dispatch: Dispatch<UpdateHouses>) => {
    try {
      const res = await handleRequest(`/houses/${id}`, "PUT", data);

      dispatch({
        type: "UPDATE_HOUSE_BY_ID",
        houses: res.data.houses,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const deleteHouseById = (id: string) => async (dispatch: Dispatch<UpdateHouses>) => {
  try {
    const res = await handleRequest(`/houses/${id}`, "DELETE");

    dispatch({
      type: "DELETE_HOUSE_BY_ID",
      houses: res.data.houses,
    });

    return true;
  } catch (e) {
    toast.error(getErrorFromResponse(e));
    return false;
  }
};

import type { Dispatch } from "react";
import { toast } from "react-hot-toast";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import type { UpdateUsers } from "src/store/types";

export const getAllUsers =
  (houseId: string, cookie?: string) => async (dispatch: Dispatch<UpdateUsers>) => {
    try {
      const res = await handleRequest(`/admin/users/${houseId}`, "GET", {
        cookie,
      });

      dispatch({
        type: "GET_ALL_USERS",
        users: res.data.users,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

export const addUser =
  (houseId: string, data: RequestData) => async (dispatch: Dispatch<UpdateUsers>) => {
    try {
      const res = await handleRequest(`/admin/users/${houseId}`, "POST", data);

      dispatch({
        type: "ADD_USER",
        users: res.data.users,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const updateUserById =
  (houseId: string, id: string, data: RequestData) => async (dispatch: Dispatch<UpdateUsers>) => {
    try {
      const res = await handleRequest(`/admin/users/${houseId}/${id}`, "PUT", data);

      dispatch({
        type: "UPDATE_USER_BY_ID",
        users: res.data.users,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const removeUserFromHouse =
  (houseId: string, id: string) => async (dispatch: Dispatch<UpdateUsers>) => {
    try {
      const res = await handleRequest(`/admin/users/${houseId}/${id}`, "DELETE");

      dispatch({
        type: "DELETE_USER_BY_ID",
        users: res.data.users,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

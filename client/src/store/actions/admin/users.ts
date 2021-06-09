import { Dispatch } from "react";
import { toast } from "react-toastify";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { UpdateUsers } from "src/store/types";

export const getAllUsers = (cookie?: string) => async (dispatch: Dispatch<UpdateUsers>) => {
  try {
    const res = await handleRequest("/admin/users", "GET", {
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

export const addUser = (data: RequestData) => async (dispatch: Dispatch<UpdateUsers>) => {
  try {
    const res = await handleRequest("/admin/users/", "POST", data);

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
  (id: string, data: RequestData) => async (dispatch: Dispatch<UpdateUsers>) => {
    try {
      const res = await handleRequest(`/admin/users/${id}`, "PUT", data);

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

export const deleteUserById = (id: string) => async (dispatch: Dispatch<UpdateUsers>) => {
  try {
    const res = await handleRequest(`/admin/users/${id}`, "DELETE");

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

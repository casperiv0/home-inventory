import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { GetAllUsers, UpdateUserById } from "src/store/types";
import { toast } from "react-toastify";

// todo
export const getAllUsers = (cookie?: string) => async (dispatch: Dispatch<GetAllUsers>) => {
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

export const updateUserById =
  (id: string, data: RequestData) => async (dispatch: Dispatch<UpdateUserById>) => {
    try {
      await handleRequest(`/admin/users/${id}`, "PUT", {
        data,
      });

      dispatch({
        type: "UPDATE_USER_BY_ID",
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

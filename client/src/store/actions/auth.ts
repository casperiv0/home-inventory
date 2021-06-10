import { Dispatch } from "react";
import { toast } from "react-toastify";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { Authenticate, SetAuthLoading } from "../types";

export const authenticate =
  (data: RequestData) =>
  async (dispatch: Dispatch<Authenticate | SetAuthLoading>): Promise<boolean> => {
    try {
      const res = await handleRequest("/auth/authenticate", "POST", data);

      dispatch({
        type: "AUTHENTICATE",
        user: res.data.user,
        isAuth: true,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const checkAuth =
  (cookie?: string) => async (dispatch: Dispatch<Authenticate | SetAuthLoading>) => {
    dispatch({ type: "SET_AUTH_LOADING", loading: true });

    try {
      const res = await handleRequest("/auth/user", "POST", {
        cookie,
      });

      dispatch({
        type: "AUTHENTICATE",
        isAuth: true,
        user: res.data.user,
      });

      dispatch({ type: "SET_AUTH_LOADING", loading: false });

      return true;
    } catch (e) {
      dispatch({ type: "SET_AUTH_LOADING", loading: false });

      return false;
    }
  };

export const logout = () => async (dispatch: Dispatch<Authenticate>) => {
  try {
    await handleRequest("/auth/logout", "POST");

    dispatch({
      type: "AUTHENTICATE",
      isAuth: false,
      user: null,
    });

    return true;
  } catch (e) {
    return false;
  }
};

import { Dispatch } from "react";
import { toast } from "react-toastify";
import { getErrorFromResponse, handleRequest, isSuccess, RequestData } from "@lib/fetch";
import { Authenticate } from "../types";

export const authenticate =
  (data: RequestData) =>
  async (dispatch: Dispatch<Authenticate>): Promise<boolean> => {
    try {
      const res = await handleRequest("/auth/authenticate", "POST", data);

      if (isSuccess(res)) {
        dispatch({
          type: "AUTHENTICATE",
          user: res.data.user,
          isAuth: true,
        });

        return true;
      }

      toast.error(res.data.error);
      return false;
    } catch (e) {
      console.error(e);

      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

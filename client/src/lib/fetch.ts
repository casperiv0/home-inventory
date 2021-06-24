import { ModalIds } from "@t/ModalIds";
import axios, { AxiosError } from "axios";
import cookie from "cookie";
import { ALLOWED_METHODS, NO_ERROR } from "./constants";
import { openModal } from "./modal";

export type RequestData = Record<string, unknown>;

/**
 * perform a request to the API
 * @param path The path for the request
 * @param method The method for the request
 * @param data optional data for the request
 */
export const handleRequest = (
  path: string,
  method: ALLOWED_METHODS,
  data?:
    | RequestData
    | {
        cookie: string;
      },
) => {
  const parsedCookie = cookie.parse((data?.cookie as string) ?? "")?.["session-cookie"];

  return axios({
    url: `${process.env.NEXT_PUBLIC_PROD_ORIGIN}/api${path}`,
    method,
    data: data ? data : null,
    withCredentials: true,
    headers: {
      Session: parsedCookie,
      "Content-Type": "application/json",
    },
  });
};

/**
 * get the error message from the response error
 * @param {*} e The error
 */
export const getErrorFromResponse = (e: AxiosError): string | null => {
  if (e.response?.status === 429) {
    openModal(ModalIds.AlertRateLimited);
    return null;
  }

  return e?.response?.data?.errors?.[0] ?? e?.response?.data?.error ?? NO_ERROR;
};

import axios from "axios";
import cookie from "cookie";
import { ALLOWED_METHODS, NO_ERROR } from "./constants";

export type RequestData = Record<string, unknown>;

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

export const getErrorFromResponse = (e: any) => {
  return e?.response?.data?.errors?.[0] ?? e?.response?.data?.error ?? NO_ERROR;
};

import { ModalIds } from "@t/ModalIds";
import axios, { AxiosResponse, AxiosError } from "axios";
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
export function handleRequest<T = any>(
  path: string,
  method: ALLOWED_METHODS,
  data?:
    | RequestData
    | {
        cookie: string;
      },
): Promise<AxiosResponse<T>> {
  const parsedCookie =
    cookie.parse((data?.cookie as string | null) ?? "")?.["session-cookie"] ?? "";

  return axios({
    url: `${process.env.NEXT_PUBLIC_PROD_ORIGIN}/api${path}`,
    method,
    data: data ?? undefined,
    withCredentials: true,
    headers: {
      Session: parsedCookie,
      "Content-Type": "application/json",
    },
  });
}

/**
 * get the error message from the response error
 * @param {unknown} error The error
 */
export function getErrorFromResponse(e: unknown): string | null {
  const error = (e instanceof Error ? e : null) as AxiosError<any> | Error | null;

  if (!error) {
    return NO_ERROR;
  }

  if ("response" in error) {
    if (error.response?.status === 429) {
      openModal(ModalIds.AlertRateLimited);
      return null;
    }

    return error.response?.data?.errors?.[0] ?? error.response?.data?.error ?? NO_ERROR;
  }

  return error.message || NO_ERROR;
}

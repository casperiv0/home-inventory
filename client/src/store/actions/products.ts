import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { Dispatch } from "react";
import { toast } from "react-toastify";
import { UpdateProducts } from "../types";

export const getAllProducts =
  (cookie?: string) =>
  async (dispatch: Dispatch<UpdateProducts>): Promise<boolean> => {
    try {
      const res = await handleRequest("/products", "GET", { cookie });

      dispatch({
        type: "GET_ALL_PRODUCTS",
        products: res.data.products,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

export const addProduct =
  (data: RequestData) =>
  async (dispatch: Dispatch<UpdateProducts>): Promise<boolean> => {
    try {
      const res = await handleRequest("/products", "POST", data);

      dispatch({
        type: "ADD_PRODUCT",
        products: res.data.products,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const updateProductById =
  (id: string, data: RequestData) => async (dispatch: Dispatch<UpdateProducts>) => {
    try {
      const res = await handleRequest(`/products/${id}`, "PUT", data);

      dispatch({
        type: "UPDATE_PRODUCT_BY_ID",
        products: res.data.products,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const deleteProductById = (id: string) => async (dispatch: Dispatch<UpdateProducts>) => {
  try {
    const res = await handleRequest(`/products/${id}`, "DELETE");

    dispatch({
      type: "DELETE_PRODUCT_BY_ID",
      products: res.data.products,
    });

    return true;
  } catch (e) {
    toast.error(getErrorFromResponse(e));
    return false;
  }
};

import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { Dispatch } from "react";
import { toast } from "react-toastify";
import { GetStats, UpdateProducts } from "../types";

export const getAllProducts =
  (houseId: string, cookie?: string) =>
  async (dispatch: Dispatch<UpdateProducts>): Promise<boolean> => {
    try {
      const res = await handleRequest(`/products/${houseId}`, "GET", { cookie });

      dispatch({
        type: "GET_ALL_PRODUCTS",
        products: res.data.products,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

export const getProductsByCategory =
  (houseId: string, category: string, cookie?: string) =>
  async (dispatch: Dispatch<UpdateProducts>) => {
    try {
      const res = await handleRequest(`/category/${houseId}/${category}`, "GET", { cookie });

      dispatch({
        type: "GET_PRODUCTS_BY_CATEGORY",
        products: res.data.products,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

export const addProduct =
  (houseId: string, data: RequestData) =>
  async (dispatch: Dispatch<UpdateProducts>): Promise<boolean> => {
    try {
      const res = await handleRequest(`/products/${houseId}`, "POST", data);

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
  (houseId: string, id: string, data: RequestData) =>
  async (dispatch: Dispatch<UpdateProducts>) => {
    try {
      const res = await handleRequest(`/products/${houseId}/${id}`, "PUT", data);

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

export const deleteProductById =
  (houseId: string, id: string) => async (dispatch: Dispatch<UpdateProducts>) => {
    try {
      const res = await handleRequest(`/products/${houseId}/${id}`, "DELETE");

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

export const getStats =
  (houseId: string, cookie?: string) => async (dispatch: Dispatch<GetStats>) => {
    try {
      const res = await handleRequest(`/products/${houseId}/stats`, "GET", { cookie });

      dispatch({
        type: "GET_STATS",
        stats: {
          totalSpent: res.data.totalSpent,
          lowOnQuantity: res.data.lowOnQuantity,
          soonToExpire: res.data.soonToExpire,
        },
      });

      return true;
    } catch (e) {
      return false;
    }
  };

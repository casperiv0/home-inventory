import type { Dispatch } from "react";
import { toast } from "react-hot-toast";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import type { UpdateCategories } from "src/store/types";

export const getAllCategories =
  (houseId: string, cookie?: string) => async (dispatch: Dispatch<UpdateCategories>) => {
    try {
      const res = await handleRequest(`/admin/categories/${houseId}`, "GET", {
        cookie,
      });

      dispatch({
        type: "GET_ALL_CATEGORIES",
        categories: res.data.categories,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

export const addCategory =
  (houseId: string, data: RequestData) => async (dispatch: Dispatch<UpdateCategories>) => {
    try {
      const res = await handleRequest(`/admin/categories/${houseId}`, "POST", data);

      dispatch({
        type: "ADD_CATEGORY",
        categories: res.data.categories,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const updateCategoryById =
  (houseId: string, id: string, data: RequestData) =>
  async (dispatch: Dispatch<UpdateCategories>) => {
    try {
      const res = await handleRequest(`/admin/categories/${houseId}/${id}`, "PUT", data);

      dispatch({
        type: "UPDATE_CATEGORY_BY_ID",
        categories: res.data.categories,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const deleteCategoryById =
  (houseId: string, id: string) => async (dispatch: Dispatch<UpdateCategories>) => {
    try {
      const res = await handleRequest(`/admin/categories/${houseId}/${id}`, "DELETE");

      dispatch({
        type: "DELETE_CATEGORY_BY_ID",
        categories: res.data.categories,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

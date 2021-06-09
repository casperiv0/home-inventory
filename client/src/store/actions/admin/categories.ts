import { Dispatch } from "react";
import { toast } from "react-toastify";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { UpdateCategories } from "src/store/types";

export const getAllCategories =
  (cookie?: string) => async (dispatch: Dispatch<UpdateCategories>) => {
    try {
      const res = await handleRequest("/admin/categories", "GET", {
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

export const addCategory = (data: RequestData) => async (dispatch: Dispatch<UpdateCategories>) => {
  try {
    const res = await handleRequest("/admin/categories", "POST", data);

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
  (id: string, data: RequestData) => async (dispatch: Dispatch<UpdateCategories>) => {
    try {
      const res = await handleRequest(`/admin/categories/${id}`, "PUT", data);

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

export const deleteCategoryById = (id: string) => async (dispatch: Dispatch<UpdateCategories>) => {
  try {
    const res = await handleRequest(`/admin/categories/${id}`, "DELETE");

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

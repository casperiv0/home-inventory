import { Dispatch } from "react";
import toast from "react-hot-toast";
import { getErrorFromResponse, handleRequest, RequestData } from "@lib/fetch";
import { UpdateShoppingList } from "../types";

export const getShoppingList =
  (houseId: string, cookie?: string) =>
  async (dispatch: Dispatch<UpdateShoppingList>): Promise<boolean> => {
    try {
      const res = await handleRequest(`/shopping-list/${houseId}`, "GET", { cookie });

      dispatch({
        type: "GET_SHOPPING_LIST",
        shoppingList: res.data.shoppingList,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

export const addProductToShoppingList =
  (houseId: string, productId: string) => async (dispatch: Dispatch<UpdateShoppingList>) => {
    try {
      const res = await handleRequest(`/shopping-list/${houseId}`, "POST", { productId });

      dispatch({
        type: "GET_SHOPPING_LIST",
        shoppingList: res.data.shoppingList,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const deleteItemFromShoppingList =
  (houseId: string, id: string) => async (dispatch: Dispatch<UpdateShoppingList>) => {
    try {
      const res = await handleRequest(`/shopping-list/${houseId}/${id}`, "DELETE");

      dispatch({
        type: "UPDATE_SHOPPING_LIST",
        shoppingList: res.data.shoppingList,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

export const updateItemInShoppingList =
  (houseId: string, id: string, data: RequestData) =>
  async (dispatch: Dispatch<UpdateShoppingList>) => {
    try {
      const res = await handleRequest(`/shopping-list/${houseId}/${id}`, "PUT", data);

      dispatch({
        type: "UPDATE_SHOPPING_LIST",
        shoppingList: res.data.shoppingList,
      });

      return true;
    } catch (e) {
      toast.error(getErrorFromResponse(e));
      return false;
    }
  };

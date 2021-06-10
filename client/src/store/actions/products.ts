import { handleRequest } from "@lib/fetch";
import { Dispatch } from "react";
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

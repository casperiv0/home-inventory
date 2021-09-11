import { Dispatch } from "react";
import toast from "react-hot-toast";
import { getErrorFromResponse, handleRequest } from "@lib/fetch";
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

// export const addProduct =
//   (houseId: string, data: RequestData) =>
//   async (dispatch: Dispatch<UpdateProducts>): Promise<boolean> => {
//     try {
//       const res = await handleRequest(`/products/${houseId}`, "POST", data);

//       dispatch({
//         type: "ADD_PRODUCT",
//         products: res.data.products,
//       });

//       return true;
//     } catch (e) {
//       toast.error(getErrorFromResponse(e));
//       return false;
//     }
//   };

// export const updateProductById =
//   (houseId: string, id: string, data: RequestData) =>
//   async (dispatch: Dispatch<UpdateProducts>) => {
//     try {
//       const res = await handleRequest(`/products/${houseId}/${id}`, "PUT", data);

//       dispatch({
//         type: "UPDATE_PRODUCT_BY_ID",
//         products: res.data.products,
//       });

//       return true;
//     } catch (e) {
//       toast.error(getErrorFromResponse(e));
//       return false;
//     }
//   };

// export const deleteProductById =
//   (houseId: string, id: string) => async (dispatch: Dispatch<UpdateProducts>) => {
//     try {
//       const res = await handleRequest(`/products/${houseId}/${id}`, "DELETE");

//       dispatch({
//         type: "DELETE_PRODUCT_BY_ID",
//         products: res.data.products,
//       });

//       return true;
//     } catch (e) {
//       toast.error(getErrorFromResponse(e));
//       return false;
//     }
//   };

// export const bulkDeleteProducts =
//   (houseId: string, productIds: string[]) => async (dispatch: Dispatch<UpdateProducts>) => {
//     try {
//       const res = await handleRequest(`/products/${houseId}/bulk`, "DELETE", { productIds });

//       dispatch({
//         type: "BULK_DELETE_PRODUCTS",
//         products: res.data.products,
//       });

//       return true;
//     } catch (e) {
//       toast.error(getErrorFromResponse(e));
//       return false;
//     }
//   };

// export const getStats =
//   (houseId: string, cookie?: string) => async (dispatch: Dispatch<GetStats>) => {
//     try {
//       const res = await handleRequest(`/products/${houseId}/stats`, "GET", { cookie });

//       dispatch({
//         type: "GET_STATS",
//         stats: {
//           totalSpent: res.data.totalSpent,
//           lowOnQuantity: res.data.lowOnQuantity,
//           soonToExpire: res.data.soonToExpire,
//         },
//       });

//       return true;
//     } catch (e) {
//       return false;
//     }
//   };

// export const importProducts =
//   (houseId: string, file: File) =>
//   async (dispatch: Dispatch<UpdateProducts | UpdateCategories>) => {
//     try {
//       const fd = new FormData();
//       fd.append("file", file, file.name);

//       const res = await handleRequest(`/import/${houseId}`, "POST", fd as any);

//       dispatch({
//         type: "IMPORT_PRODUCTS",
//         products: res.data.products,
//       });

//       dispatch({
//         type: "IMPORT_CATEGORIES",
//         categories: res.data.categories,
//       });

//       return true;
//     } catch (e) {
//       toast.error(getErrorFromResponse(e));
//       return false;
//     }
//   };

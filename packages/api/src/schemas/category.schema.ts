import * as yup from "yup";

const CATEGORY_NAME = yup.string().required().lowercase().max(255);

export const categorySchema = {
  name: CATEGORY_NAME,
};

export const importCategorySchema = {
  name: CATEGORY_NAME,
  id: yup.string().required(),
};

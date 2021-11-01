import * as yup from "yup";

const CATEGORY_NAME = yup.string().required().lowercase().max(255);

export const categorySchema = yup.object({
  name: CATEGORY_NAME,
});

export const importCategorySchema = yup.object({
  name: CATEGORY_NAME,
  id: yup.string().required(),
});

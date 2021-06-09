import * as yup from "yup";

export const createProductSchema = {
  name: yup
    .string()
    .required()
    .lowercase("Name must be lowercase")
    .min(2, "Name must be at least 2 characters long."),
  quantity: yup.number().required(),
  price: yup.number().required(),
  expirationDate: yup.string(),
  categoryId: yup.string(),
};

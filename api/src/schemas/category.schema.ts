import * as yup from "yup";

export const categorySchema = {
  name: yup.string().required().lowercase().max(255),
};

import * as yup from "yup";

export const authenticateSchema = {
  email: yup.string().required().email(),
  password: yup.string().required(),
};

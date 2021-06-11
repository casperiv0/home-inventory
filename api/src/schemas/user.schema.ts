import * as yup from "yup";
import { PASSWORD } from "./auth.schema";

export const updateUserSchema = {
  role: yup
    .string()
    .required()
    .matches(/ADMIN|USER|OWNER/, "Role must match 'ADMIN' or 'USER'"),
  name: yup.string().required(),
};

export const createUserSchema = {
  ...updateUserSchema,
  password: PASSWORD,
  email: yup.string().email().required(),
};

import * as yup from "yup";

const ROLE = yup
  .string()
  .required()
  .matches(/ADMIN|USER|OWNER/, "Role must match 'ADMIN' or 'USER'");

export const updateUserSchema = {
  role: ROLE,
};

export const createUserSchema = {
  role: ROLE,
  email: yup.string().email().required(),
};

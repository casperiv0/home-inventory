import * as yup from "yup";

export const updateUserSchema = {
  role: yup
    .string()
    .required()
    .matches(/ADMIN|USER|OWNER/, "Role must match 'ADMIN' or 'USER'"),
  name: yup.string().required(),
};

export const createUserSchema = {
  ...updateUserSchema,
  email: yup.string().email().required(),
};

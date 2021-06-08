import * as yup from "yup";

export const updateUserSchema = {
  role: yup
    .string()
    .required()
    .matches(/ADMIN|USER/, "Role must match 'ADMIN' or 'USER'"),
  name: yup.string().required(),
};

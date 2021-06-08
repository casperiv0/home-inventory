import * as yup from "yup";

export const authenticateSchema = {
  email: yup.string().required().email(),
  password: yup.string().required(),
};

export const newPasswordSchema = {
  oldPassword: yup.string().required(),
  newPassword: yup.string().required(),
  confirmPassword: yup.string().required(),
};

import * as yup from "yup";

const PASSWORD = yup.string().required().min(8);

export const authenticateSchema = {
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: PASSWORD,
};

export const newPasswordSchema = {
  oldPassword: PASSWORD,
  newPassword: PASSWORD,
  confirmPassword: PASSWORD,
};

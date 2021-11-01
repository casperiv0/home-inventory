import * as yup from "yup";

export const PASSWORD = yup.string().required().min(8);

export const authenticateSchema = (name = true) =>
  yup.object({
    email: yup.string().required().email(),
    name: name ? yup.string().required() : yup.string(),
    password: PASSWORD,
  });

export const newPasswordSchema = yup.object({
  oldPassword: PASSWORD,
  newPassword: PASSWORD,
  confirmPassword: PASSWORD,
});

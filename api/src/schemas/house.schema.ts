import * as yup from "yup";

export const createHouseSchema = {
  name: yup.string().required().min(2, "Name must be at least 2 characters long."),
};

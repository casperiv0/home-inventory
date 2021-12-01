import * as yup from "yup";

const HOUSE_NAME = yup.string().required().min(2, "Name must be at least 2 characters long.");

export const createHouseSchema = {
  name: HOUSE_NAME,
};

export const updateHouseSchema = {
  name: HOUSE_NAME,
  currency: yup.string().required().max(5),
};

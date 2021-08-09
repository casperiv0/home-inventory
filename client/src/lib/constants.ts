export const NO_ERROR = "An unexpected error occurred.";

export type ALLOWED_METHODS = "PATCH" | "PUT" | "DELETE" | "OPTIONS" | "GET" | "POST";

export const roles = ["admin", "user"];
export const selectRoles = roles.map((r) => ({
  label: r.toUpperCase(),
  value: r.toUpperCase(),
}));

/**
 * all user roles
 */
export const userRoles = {
  OWNER: 3,
  ADMIN: 2,
  USER: 1,
};

/**
 * available filters that are used to filter products.
 */
export const filters = {
  name: "Name",

  createdAt: "Created at",
  updatedAt: "Updated at",

  price: "Price lowest",
  priceHigh: "Price highest",

  quantity: "Quantity lowest",
  quantityHigh: "Quantity highest",
};

export type FilterKeys = keyof typeof filters;

export const MAX_ITEMS_IN_TABLE = 20;

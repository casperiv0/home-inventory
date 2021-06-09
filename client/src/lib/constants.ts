export const NO_ERROR = "An unexpected error occurred.";

export type ALLOWED_METHODS = "PATCH" | "PUT" | "DELETE" | "OPTIONS" | "GET" | "POST";

export const roles = ["admin", "user"];
export const selectRoles = roles.map((r) => ({ label: r, value: r.toUpperCase() }));

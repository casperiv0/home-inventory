export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: UserRole;
}

export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  USER = "USER",
}

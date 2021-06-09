export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

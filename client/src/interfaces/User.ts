export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;

  houseRoles: {
    id: string;
    userId: string;
    houseId: string;
    role: UserRole;
  }[];
}

export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  USER = "USER",
}

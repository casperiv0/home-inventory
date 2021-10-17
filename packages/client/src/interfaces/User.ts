export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  houseId: string | null;

  houseRoles: HouseRole[];
}

export interface HouseRole {
  id: string;
  role: UserRole;
  houseId: string;
  userId: string;
}

export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  USER = "USER",
}

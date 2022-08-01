import { User } from "@t/User";

export function getUserRole(user: User | null, houseId: string) {
  return user?.houseRoles.find((r) => r.houseId === houseId);
}

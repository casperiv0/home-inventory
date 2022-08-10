import type { HouseRole, User, UserRole } from "@prisma/client";
import React from "react";
import { useHouseById } from "./queries/useHouse";
import { useUser } from "./queries/useUser";

/**
 * check if the authenticated user has access to a page based on their role.
 * @param {UserRole} role The role of the authenticated user
 */
export function useHasRole(role: UserRole) {
  const { user, isLoading: isUserLoading } = useUser();
  const { house } = useHouseById();

  const [hasAccess, setAccess] = React.useState(true);

  React.useEffect(() => {
    if (!user || !house) return;

    const currentRole = getUserRole(user, house.id);
    if (!currentRole) return;

    const userRole = userRoles[currentRole.role];

    if (userRole < userRoles[role]) {
      return setAccess(false);
    }

    setAccess(true);
  }, [user, house, role]);

  return { loading: isUserLoading, hasAccess };
}

export function getUserRole(user: (User & { houseRoles: HouseRole[] }) | null, houseId: string) {
  return user?.houseRoles.find((r) => r.houseId === houseId);
}

export const userRoles = {
  OWNER: 3,
  ADMIN: 2,
  USER: 1,
};

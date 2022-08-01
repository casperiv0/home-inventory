import { userRoles } from "@lib/constants";
import type { State } from "@t/State";
import type { UserRole } from "@t/User";
import { getUserRole } from "@utils/getUserRole";
import React from "react";
import { useSelector } from "react-redux";
import { useHouseId } from "./useHouseId";

/**
 * check if the authenticated user has access to a page based on their role.
 * @param {UserRole} role The role of the authenticated user
 */
export function useHasAccess(role: UserRole) {
  const auth = useSelector((state: State) => state.auth);
  const [hasAccess, setAccess] = React.useState(true);
  const houseId = useHouseId();

  React.useEffect(() => {
    if (!auth.user || !auth.isAuth) return;

    const currentRole = getUserRole(auth.user, houseId);
    if (!currentRole) return;

    const userRole = userRoles[currentRole.role];

    if (userRole < userRoles[role]) {
      return setAccess(false);
    }

    setAccess(true);
  }, [auth, houseId, role]);

  return { loading: auth.loading, hasAccess };
}

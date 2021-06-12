import { userRoles } from "@lib/constants";
import { State } from "@t/State";
import { UserRole } from "@t/User";
import { getUserRole } from "@utils/getUserRole";
import React from "react";
import { useSelector } from "react-redux";
import { useHouseId } from "./useHouseId";

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

import { userRoles } from "@lib/constants";
import { State } from "@t/State";
import { UserRole } from "@t/User";
import React from "react";
import { useSelector } from "react-redux";

export function useHasAccess(role: UserRole) {
  const auth = useSelector((state: State) => state.auth);
  const [hasAccess, setAccess] = React.useState(true);

  React.useEffect(() => {
    if (!auth.user || !auth.isAuth) return;
    const userRole = userRoles[auth.user?.role];

    if (userRole < userRoles[role]) {
      return setAccess(false);
    }

    setAccess(true);
  }, [auth, role]);

  return { loading: auth.loading, hasAccess };
}

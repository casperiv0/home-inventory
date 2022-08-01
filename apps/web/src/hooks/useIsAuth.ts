import * as React from "react";
import type { State } from "@t/State";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

/**
 * check if someone is authenticated.
 */
export function useIsAuth() {
  const { isAuth, loading } = useSelector((state: State) => state.auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth/login");
    }
  }, [isAuth, loading, router]);
}

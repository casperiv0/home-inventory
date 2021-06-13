import * as React from "react";
import { State } from "@t/State";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

/**
 * check if someone is authenticated.
 */
export function useValidHouse() {
  const state = useSelector((state: State) => state);
  const router = useRouter();

  React.useEffect(() => {
    if (state.houses.state === "LOADING") return;

    if (state.houses.state === "ERROR" || (state.houses as any).code === 404) {
      router.push("/404");
    }
  }, [router, state.houses]);
}

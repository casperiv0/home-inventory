import { useRouter } from "next/router";

/**
 * return the current house id
 */
export function useHouseId() {
  const router = useRouter();

  return router.query.houseId as string;
}

import { useRouter } from "next/router";

/**
 * get the current house id
 */
export function useHouseId() {
  const router = useRouter();

  return router.query.houseId as string;
}

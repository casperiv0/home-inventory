import { useRouter } from "next/router";

export function useHouseId() {
  const router = useRouter();

  return router.query.houseId as string;
}

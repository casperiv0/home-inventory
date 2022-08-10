import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export function useHouseById(_houseId?: string) {
  const router = useRouter();
  const houseId = _houseId ?? (router.query.houseId as string);
  const houseQuery = trpc.useQuery(["houses.getHouseById", { id: houseId }], {
    enabled: !!houseId,
  });

  return { house: houseQuery.data ?? null, ...houseQuery };
}

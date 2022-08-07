import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export default function HousePage() {
  const router = useRouter();
  const houseId = router.query.houseId as string;

  console.log({ query: router.query });

  const statsQuery = trpc.useQuery(["houses.getHouseStats", { id: houseId }]);

  console.log({ data: statsQuery.data });

  return (
    <div>
      <p className="text-neutral-700">
        This page is still under construction. Please check back later to this page.
      </p>

      <Link href={`/${houseId}/products`}>
        <a className="underline mt-4 block">Products page available here.</a>
      </Link>
    </div>
  );
}

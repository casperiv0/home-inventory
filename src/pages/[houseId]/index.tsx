import Link from "next/link";
import { useRouter } from "next/router";

export default function HousePage() {
  const router = useRouter();
  const houseId = router.query.houseId as string;

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

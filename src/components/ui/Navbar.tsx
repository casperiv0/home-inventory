import { Dropdown } from "components/dropdown/Dropdown";
import { signOut } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames } from "utils/classNames";
import { trpc } from "utils/trpc";
import { Button } from "./Button";

export function Navbar() {
  const router = useRouter();
  const userQuery = trpc.useQuery(["user.getSession"]);
  const user = userQuery.data?.user;

  const houseId = router.query.houseId as string;
  const houseQuery = trpc.useQuery(["houses.getHouseById", { id: houseId }], {
    enabled: !!houseId,
  });
  const house = houseQuery.data;

  if (!user) {
    return null;
  }

  return (
    <nav className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
      <div>
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a>
              <h1 className="font-bold font-serif text-xl">Home Inventory</h1>
            </a>
          </Link>

          <Dropdown
            side="left"
            alignOffset={0}
            trigger={
              <Button className="p-0 overflow-hidden">
                <Image alt={user!.email} src={user!.imageUrl!} width={35} height={35} />
              </Button>
            }
          >
            <Dropdown.Item onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Dropdown.Item>
          </Dropdown>
        </div>

        {house ? (
          <ul className="flex gap-2 mb-5">
            <li
              className={classNames(
                "hover:underline cursor-pointer",
                router.asPath === `/${houseId}` && "font-medium underline",
              )}
            >
              <Link href={`/${houseId}`}>
                <a>Home</a>
              </Link>
            </li>
            <li
              className={classNames(
                "hover:underline cursor-pointer",
                router.asPath === `/${houseId}/products` && "font-medium underline",
              )}
            >
              <Link href={`/${houseId}/products`}>
                <a>Products</a>
              </Link>
            </li>
            <li
              className={classNames(
                "hover:underline cursor-pointer",
                router.asPath === `/${houseId}/settings/categories` && "font-medium underline",
              )}
            >
              <Link href={`/${houseId}/settings/categories`}>
                <a>Settings</a>
              </Link>
            </li>
          </ul>
        ) : null}
      </div>
    </nav>
  );
}

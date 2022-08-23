import { UserRole } from "@prisma/client";
import { Dropdown } from "components/dropdown/Dropdown";
import { useHouseById } from "hooks/queries/useHouse";
import { useUser } from "hooks/queries/useUser";
import { useHasRole } from "hooks/useHasRole";
import { signOut } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames } from "utils/classNames";
import { Button } from "./Button";

export function Navbar() {
  const router = useRouter();

  const { user } = useUser();
  const { house } = useHouseById();
  const { hasAccess } = useHasRole(UserRole.ADMIN);

  if (!user) {
    return null;
  }

  return (
    <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
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
                router.asPath === `/${house.id}` && "font-medium underline",
              )}
            >
              <Link href={`/${house.id}`}>
                <a>Home</a>
              </Link>
            </li>
            <li
              className={classNames(
                "hover:underline cursor-pointer",
                router.asPath === `/${house.id}/products` && "font-medium underline",
              )}
            >
              <Link href={`/${house.id}/products`}>
                <a>Products</a>
              </Link>
            </li>
            {hasAccess ? (
              <>
                <li
                  className={classNames(
                    "hover:underline cursor-pointer",
                    router.asPath === `/${house.id}/settings/categories` && "font-medium underline",
                  )}
                >
                  <Link href={`/${house.id}/settings/categories`}>
                    <a>Categories</a>
                  </Link>
                </li>
                <li
                  className={classNames(
                    "hover:underline cursor-pointer",
                    router.asPath === `/${house.id}/settings/users` && "font-medium underline",
                  )}
                >
                  <Link href={`/${house.id}/settings/users`}>
                    <a>Users</a>
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        ) : null}
      </div>
    </nav>
  );
}

import { Dropdown } from "components/dropdown/Dropdown";
import { signOut } from "next-auth/react";
import Image from "next/future/image";
import { trpc } from "utils/trpc";
import { Button } from "./Button";

export function Navbar() {
  const userQuery = trpc.useQuery(["user.getSession"]);
  const user = userQuery.data?.user;

  if (!user) {
    return null;
  }

  return (
    <nav className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="relative flex items-center justify-between h-16">
        <h1 className="font-bold font-serif text-2xl">Home Inventory</h1>

        <Dropdown
          side="bottom"
          trigger={
            <Button className="p-0 rounded-full overflow-hidden">
              <Image src={user!.imageUrl!} width={40} height={40} />
            </Button>
          }
        >
          <Dropdown.Item onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Dropdown.Item>
        </Dropdown>
      </div>
    </nav>
  );
}

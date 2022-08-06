import { UserRole } from "@prisma/client";
import { Button } from "components/ui/Button";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "utils/trpc";
import { EditIcon } from "____/web/src/components/icons/Edit";

export default function HomePage() {
  const userQuery = trpc.useQuery(["user.getSession"]);
  const housesQuery = trpc.useQuery(["houses.getUserHouses"]);
  const user = userQuery.data?.user;

  const houseMutation = trpc.useMutation(["houses.addHouse"]);

  return (
    <>
      <Head>
        <title>Home - Inventory</title>
      </Head>

      <header className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-800">Houses</h1>
          <p className="mt-2 text-neutral-700">
            Below you can find all the houses you are a part of.
          </p>
        </div>

        <Button
          onClick={() => {
            houseMutation.mutate({
              name: "New House",
            });
          }}
        >
          Add house
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {housesQuery.data?.map((house) => {
          const role = house.houseRoles.find((r) => r.userId === user?.id);

          return (
            <div key={house.id} className="p-4 rounded-sm bg-neutral-200">
              <header className="flex items-center justify-between mb-2">
                <Link href={`/${house.id}`}>
                  <a className="font-semibold" href={`/${house.id}`}>
                    <h1>{house.name}</h1>
                  </a>
                </Link>

                {role?.role === UserRole.OWNER ? (
                  <Button variant="transparent" size="xxs">
                    <EditIcon aria-label="Manage house" />
                  </Button>
                ) : null}
              </header>

              <p>
                <strong>Users:</strong> {house.users.length}
              </p>
              <p>
                <strong>Products:</strong> {house.products.length}
              </p>
            </div>
          );
        })}
      </div>

      {/* <ManageHouseModal house={tempHouse} />
      <AddHouseModal /> */}
    </>
  );
}

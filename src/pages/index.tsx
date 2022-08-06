import * as React from "react";
import { type House, UserRole } from "@prisma/client";
import { Button } from "components/ui/Button";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "utils/trpc";
import { Modal } from "components/modal/Modal";
import { Pencil } from "react-bootstrap-icons";
import { HouseForm } from "components/forms/HouseForm";

export default function HomePage() {
  const userQuery = trpc.useQuery(["user.getSession"]);
  const housesQuery = trpc.useQuery(["houses.getUserHouses"]);
  const user = userQuery.data?.user;

  const [isOpen, setIsOpen] = React.useState(false);
  const [tempHouse, setTempHouse] = React.useState<House | null>(null);

  function handleClose() {
    setTempHouse(null);
    setIsOpen(false);
  }

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

        <Button onClick={() => setIsOpen(true)}>Add house</Button>
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
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                      setTempHouse(house);
                    }}
                    variant="transparent"
                    size="xxs"
                  >
                    <Pencil aria-label="Manage house" />
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

      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <Modal.Title>{tempHouse ? "Edit Income" : "Add new income"}</Modal.Title>

        <div>
          <HouseForm onSubmit={handleClose} house={tempHouse} />
        </div>
      </Modal>

      {/* <ManageHouseModal house={tempHouse} />
      <AddHouseModal /> */}
    </>
  );
}

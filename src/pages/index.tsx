import * as React from "react";
import { UserRole } from "@prisma/client";
import { Button } from "components/ui/Button";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "utils/trpc";
import { Modal } from "components/modal/Modal";
import { Pencil } from "react-bootstrap-icons";
import { HouseForm } from "components/forms/HouseForm";
import { useTemporaryItem } from "hooks/useTemporaryItem";
import { useUser } from "hooks/queries/useUser";

export default function HomePage() {
  const { user } = useUser();
  const housesQuery = trpc.houses.getUserHouses.useQuery();
  const houses = housesQuery.data ?? [];

  const [isOpen, setIsOpen] = React.useState(false);
  const [tempHouse, houseState] = useTemporaryItem(houses);

  function handleClose() {
    houseState.setTempId(null);
    setIsOpen(false);
  }

  return (
    <>
      <Head>
        <title>Home - Inventory</title>
      </Head>

      <header className="flex flex-col md:flex-row md:items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Houses</h1>
          <p className="mt-2 text-neutral-300">
            Below you can find all the houses you are a part of.
          </p>
        </div>

        <Button className="mt-3 md:mt-0 w-fit" onClick={() => setIsOpen(true)}>
          Add house
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {houses.map((house) => {
          const role = house.houseRoles.find((r) => r.userId === user?.id);

          return (
            <div key={house.id} className="p-6 rounded-sm bg-secondary shadow-md">
              <header className="flex items-center justify-between mb-2">
                <Link href={`/${house.id}`}>
                  <a className="font-semibold text-xl" href={`/${house.id}`}>
                    <h1>{house.name}</h1>
                  </a>
                </Link>

                {role?.role === UserRole.OWNER ? (
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                      houseState.setTempId(house.id);
                    }}
                    variant="transparent"
                    size="xxs"
                  >
                    <Pencil className="fill-neutral-400" aria-label="Manage house" />
                  </Button>
                ) : null}
              </header>

              <p className="text-sm">
                <strong>Users:</strong> {house.users.length}
              </p>
              <p className="text-sm">
                <strong>Products:</strong> {house.products.length}
              </p>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <Modal.Title>{tempHouse ? "Edit House" : "Add new house"}</Modal.Title>

        <div>
          <HouseForm onSubmit={handleClose} house={tempHouse} />
        </div>
      </Modal>
    </>
  );
}

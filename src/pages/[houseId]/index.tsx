import * as React from "react";
import { HouseForm } from "components/forms/HouseForm";
import { useHouseById } from "hooks/queries/useHouse";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { Modal } from "components/modal/Modal";
import { Button } from "components/ui/Button";
import { useHasRole } from "hooks/useHasRole";
import { UserRole } from "@prisma/client";

export default function HousePage() {
  const router = useRouter();
  const houseId = router.query.houseId as string;

  const { house } = useHouseById();
  const statsQuery = trpc.useQuery(["houses.getHouseStats", { id: houseId }]);
  const { hasAccess } = useHasRole(UserRole.ADMIN);

  const [isOpen, setIsOpen] = React.useState(false);

  if (!house) {
    return null;
  }

  const { lowOnQuantity, soonToExpire, totalSpentLast30Days } = statsQuery.data ?? {};
  const currency = "€";

  const soonToExpireText =
    soonToExpire?.length === 1 ? (
      <>
        There is <strong>1</strong> item that is going to expire soon.
      </>
    ) : (
      <>
        There are <strong>{soonToExpire?.length}</strong> items that are going to expire soon.
      </>
    );

  const lowOnQuantityText =
    lowOnQuantity?.length === 1 ? (
      <>
        There is <strong>1</strong> item that is low on quantity.
      </>
    ) : (
      <>
        There are <strong>{lowOnQuantity?.length}</strong> items that are low on quantity.
      </>
    );

  return (
    <div className="mt-3">
      <Head>
        <title>{`${house.name} - Home Inventory`}</title>
      </Head>

      <header className="flex flex-col md:flex-row md:items-center justify-between mt-4 mb-7">
        <h1 className="capitalize text-3xl md:text-4xl font-bold font-serif text-neutral-800">
          {house.name}
        </h1>

        {hasAccess ? (
          <Button className="mt-3 md:mt-0 w-fit" onClick={() => setIsOpen(true)}>
            Manage House
          </Button>
        ) : null}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="p-4 rounded-sm bg-neutral-200/70 shadow-md">
          <h1 className="text-lg font-semibold mb-3">Total spendings the last 30 days</h1>

          <p>
            There was a total of{" "}
            <strong>
              {currency}
              {totalSpentLast30Days}
            </strong>{" "}
            spent this month.
          </p>
        </div>

        <div className="p-4 rounded-sm bg-neutral-200/70 shadow-md">
          <h1 className="text-lg font-semibold mb-3">Soon to expire</h1>

          <p>{soonToExpireText}</p>
        </div>

        <div className="p-4 rounded-sm bg-neutral-200/70 shadow-md">
          <h1 className="text-lg font-semibold mb-3">Low on quantity</h1>

          <p>{lowOnQuantityText}</p>
        </div>
      </div>

      <p className="text-neutral-700 mt-10">More info soon...</p>

      <Modal isOpen={isOpen} onOpenChange={() => setIsOpen(false)}>
        <Modal.Title>Edit House</Modal.Title>

        <div>
          <HouseForm onSubmit={() => setIsOpen(false)} house={house} />
        </div>
      </Modal>
    </div>
  );
}

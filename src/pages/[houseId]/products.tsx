import * as React from "react";
import { Table } from "components/table/Table";
import { Button } from "components/ui/Button";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import type { SortingState } from "@tanstack/react-table";
import { useTablePagination } from "hooks/useTablePagination";

export default function HousePage() {
  const [page, setPage] = React.useState<number>(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const router = useRouter();
  const houseId = router.query.houseId as string;

  const houseQuery = trpc.useQuery(["houses.getHouseById", { id: houseId }]);
  const productsQuery = trpc.useQuery([
    "products.getProductsByHouseId",
    { houseId, page, sorting },
  ]);

  const pagination = useTablePagination({
    isLoading: productsQuery.isLoading,
    page,
    setPage,
    query: productsQuery,
  });

  const house = houseQuery.data;

  console.log({ house });

  return (
    <>
      <Head>
        <title>{`Products for ${house?.name} - Home Inventory`}</title>
      </Head>
      <header className="flex items-center justify-between mt-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-800">Products</h1>
          <p className="mt-2 text-neutral-700"></p>
        </div>

        <Button>Add Product</Button>
      </header>

      <Table
        options={{ sorting, setSorting }}
        pagination={pagination}
        data={(house?.products ?? []).map((product) => ({
          name: product.name,
        }))}
        columns={[
          { header: "Amount", accessorKey: "name" },
          { header: "Month", accessorKey: "month" },
          { header: "Year", accessorKey: "year" },
          { header: "Description", accessorKey: "description" },
          { header: "actions", accessorKey: "actions" },
        ]}
      />
    </>
  );
}

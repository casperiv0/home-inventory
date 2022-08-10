import * as React from "react";
import { Table } from "components/table/Table";
import { Button } from "components/ui/Button";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import type { SortingState } from "@tanstack/react-table";
import { useTablePagination } from "hooks/useTablePagination";
import type { Product } from "@prisma/client";
import { Modal } from "components/modal/Modal";
import { ProductForm } from "components/forms/ProductForm";
import type { TableFilter } from "components/table/filters/TableFilters";
import { useTemporaryItem } from "hooks/useTemporaryItem";
import { useHouseById } from "hooks/queries/useHouse";

export default function HousePage() {
  const [page, setPage] = React.useState<number>(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filters, setFilters] = React.useState<TableFilter[]>([]);

  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const houseId = router.query.houseId as string;

  const { house } = useHouseById();
  const productsQuery = trpc.useQuery(
    ["products.getProductsByHouseId", { houseId, page, sorting, filters }],
    { keepPreviousData: true },
  );
  const products = productsQuery.data?.items ?? [];
  const [tempProduct, productState] = useTemporaryItem(products);

  const pagination = useTablePagination({
    isLoading: productsQuery.isLoading,
    page,
    setPage,
    query: productsQuery,
  });

  function handleClose() {
    productState.setTempId(null);
    setIsOpen(false);
  }

  function handleEditDelete(product: Product) {
    setIsOpen(true);
    productState.setTempId(product.id);
  }

  if (!house || !productsQuery.data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Products for ${house.name} - Home Inventory`}</title>
      </Head>
      <header className="flex items-center justify-between mt-4 mb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-800">Products</h1>
        </div>

        <Button onClick={() => setIsOpen(true)}>Add Product</Button>
      </header>

      {productsQuery.data.items.length <= 0 && !filters.length ? (
        <p>This house does not have any products created yet.</p>
      ) : (
        <Table
          query={productsQuery}
          options={{ sorting, setSorting, filters, setFilters }}
          pagination={pagination}
          data={productsQuery.data.items.map((product) => {
            const totalPrice = product.prices.reduce((acc, price) => acc + price, 0);

            return {
              name: product.name,
              price: product.price,
              totalPrice,
              quantity: product.quantity,
              expirationDate: product.expirationDate
                ? new Date(product.expirationDate).toDateString()
                : "—",
              category: product.category?.name ?? "—",
              createdBy: product.createdBy.email,
              actions: (
                <Button size="xs" onClick={() => handleEditDelete(product)}>
                  Edit
                </Button>
              ),
            };
          })}
          columns={[
            { header: "Name", accessorKey: "name" },
            { header: "Price", accessorKey: "price" },
            { header: "Total Price", accessorKey: "totalPrice", enableSorting: false },
            { header: "Quantity", accessorKey: "quantity" },
            { header: "Expiration Date", accessorKey: "expirationDate" },
            { header: "Category", accessorKey: "category" },
            { header: "Created By", accessorKey: "createdBy", enableSorting: false },
            { header: "actions", accessorKey: "actions" },
          ]}
          filterTypes={[
            { name: "name", filterType: "string" },
            { name: "price", filterType: "number" },
            { name: "quantity", filterType: "number" },
            { name: "expirationDate", filterType: "date" },
          ]}
        />
      )}

      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <Modal.Title>{tempProduct ? "Edit Product" : "Add new product"}</Modal.Title>

        <div>
          <ProductForm houseId={house.id} onSubmit={handleClose} product={tempProduct} />
        </div>
      </Modal>
    </>
  );
}

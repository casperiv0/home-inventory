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

export default function HousePage() {
  const [page, setPage] = React.useState<number>(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [tempProduct, setTempProduct] = React.useState<Product | null>(null);

  const router = useRouter();
  const houseId = router.query.houseId as string;

  const houseQuery = trpc.useQuery(["houses.getHouseById", { id: houseId }]);
  const house = houseQuery.data;

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

  function handleClose() {
    setTempProduct(null);
    setIsOpen(false);
  }

  function handleEditDelete(product: Product) {
    setIsOpen(true);
    setTempProduct(product);
  }

  if (!house || !productsQuery.data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Products for ${house.name} - Home Inventory`}</title>
      </Head>
      <header className="flex items-center justify-between mt-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-800">Products</h1>
          {/* <p className="mt-2 text-neutral-700"></p> */}
        </div>

        <Button onClick={() => setIsOpen(true)}>Add Product</Button>
      </header>

      <Table
        options={{ sorting, setSorting }}
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
            actions: (
              <Button size="xs" onClick={() => handleEditDelete(product)}>
                Edit
              </Button>
            ),
          };
        })}
        columns={[
          { header: "Amount", accessorKey: "name" },
          { header: "Price", accessorKey: "price" },
          { header: "Total Price", accessorKey: "totalPrice" },
          { header: "Quantity", accessorKey: "quantity" },
          { header: "Expiration Date", accessorKey: "expirationDate" },
          { header: "actions", accessorKey: "actions" },
        ]}
      />

      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <Modal.Title>{tempProduct ? "Edit Product" : "Add new product"}</Modal.Title>

        <div>
          <ProductForm houseId={house.id} onSubmit={handleClose} product={tempProduct} />
        </div>
      </Modal>
    </>
  );
}

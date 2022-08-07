import * as React from "react";
import { Table } from "components/table/Table";
import { Button } from "components/ui/Button";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { useTablePagination } from "hooks/useTablePagination";
import type { Category } from "@prisma/client";
import { Modal } from "components/modal/Modal";
import type { SortingState } from "@tanstack/react-table";
import { CategoryForm } from "components/forms/CategoryForm";

export default function ManageCategoriesPage() {
  const [page, setPage] = React.useState<number>(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [tempCategory, setTempCategory] = React.useState<Category | null>(null);

  const router = useRouter();
  const houseId = router.query.houseId as string;

  const houseQuery = trpc.useQuery(["houses.getHouseById", { id: houseId }]);
  const house = houseQuery.data;

  const categoriesQuery = trpc.useQuery(["categories.getCategoriesByHouseId", { houseId, page }], {
    keepPreviousData: true,
  });

  const pagination = useTablePagination({
    isLoading: categoriesQuery.isLoading,
    page,
    setPage,
    query: categoriesQuery,
  });

  function handleClose() {
    setTempCategory(null);
    setIsOpen(false);
  }

  function handleEditDelete(category: Category) {
    setIsOpen(true);
    setTempCategory(category);
  }

  if (!house || !categoriesQuery.data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Categories for ${house.name} - Home Inventory`}</title>
      </Head>
      <header className="flex items-center justify-between mt-4 mb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-800">Categories</h1>
          <p className="mt-3 font-medium text-neutral-800">
            A list of categories that can be appended to products.
          </p>
        </div>

        <Button onClick={() => setIsOpen(true)}>Add Category</Button>
      </header>

      {categoriesQuery.data.items.length <= 0 ? (
        <p className="text-neutral-700">This house does not have any categories created yet.</p>
      ) : (
        <Table
          query={categoriesQuery}
          options={{ sorting, setSorting }}
          pagination={pagination}
          data={categoriesQuery.data.items.map((category) => {
            return {
              name: category.name,
              actions: (
                <Button size="xs" onClick={() => handleEditDelete(category)}>
                  Edit
                </Button>
              ),
            };
          })}
          columns={[
            { header: "Name", accessorKey: "name" },
            { header: "actions", accessorKey: "actions" },
          ]}
        />
      )}

      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <Modal.Title>{tempCategory ? "Edit Category" : "Add new category"}</Modal.Title>

        <div>
          <CategoryForm houseId={house.id} onSubmit={handleClose} category={tempCategory} />
        </div>
      </Modal>
    </>
  );
}

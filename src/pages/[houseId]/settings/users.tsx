import * as React from "react";
import { Table } from "components/table/Table";
import { Button } from "components/ui/Button";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { useTablePagination } from "hooks/useTablePagination";
import type { User } from "@prisma/client";
import { Modal } from "components/modal/Modal";
import type { SortingState } from "@tanstack/react-table";
// import { UserForm } from "components/forms/UserForm";
import { useTemporaryItem } from "hooks/useTemporaryItem";
import { useHouseById } from "hooks/queries/useHouse";
import { getUserRole } from "hooks/useHasRole";
import { UserForm } from "components/forms/UserForm";

export default function ManageUsersPage() {
  const [page, setPage] = React.useState<number>(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const houseId = router.query.houseId as string;
  const { house } = useHouseById();

  const usersQuery = trpc.useQuery(["users.getUsersByHouseId", { houseId, page }], {
    keepPreviousData: true,
  });
  const users = usersQuery.data?.items ?? [];
  const [tempUser, usersState] = useTemporaryItem(users);

  const pagination = useTablePagination({
    isLoading: usersQuery.isLoading,
    page,
    setPage,
    query: usersQuery,
  });

  function handleClose() {
    usersState.setTempId(null);
    setIsOpen(false);
  }

  function handleEditDelete(user: User) {
    setIsOpen(true);
    usersState.setTempId(user.id);
  }

  if (!house || !usersQuery.data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Users for ${house.name} - Home Inventory`}</title>
      </Head>
      <header className="flex items-center justify-between mt-4 mb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Users</h1>
          <p className="mt-3 font-medium text-neutral-300">
            A list of users that are connected with the current house.
          </p>
        </div>

        <Button onClick={() => setIsOpen(true)}>Add User</Button>
      </header>

      {usersQuery.data.items.length <= 0 ? (
        <p className="text-neutral-300">This house does not have any users connected yet.</p>
      ) : (
        <Table
          query={usersQuery}
          options={{ sorting, setSorting }}
          pagination={pagination}
          data={usersQuery.data.items.map((user) => {
            return {
              name: user.name,
              email: user.email,
              role: <span className="font-mono">{getUserRole(user, house.id)?.role ?? "—"}</span>,
              actions: (
                <Button size="xs" onClick={() => handleEditDelete(user)}>
                  Edit
                </Button>
              ),
            };
          })}
          columns={[
            { header: "Name", accessorKey: "name" },
            { header: "Email", accessorKey: "email" },
            { header: "Role", accessorKey: "role" },
            { header: "actions", accessorKey: "actions" },
          ]}
        />
      )}

      <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <Modal.Title>{tempUser ? "Edit User" : "Add new user"}</Modal.Title>

        <div>
          <UserForm houseId={house.id} onSubmit={handleClose} user={tempUser} />
        </div>
      </Modal>
    </>
  );
}

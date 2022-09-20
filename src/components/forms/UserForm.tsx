import * as React from "react";
import { HouseRole, User, UserRole } from "@prisma/client";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { Modal } from "components/modal/Modal";
import { Button } from "components/ui/Button";
import { Loader } from "components/ui/Loader";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { classNames } from "utils/classNames";
import { getUserRole } from "hooks/useHasRole";
import { Select } from "components/form/Select";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().min(2).email(),
  role: z.nativeEnum(UserRole),
});

interface Props {
  houseId: string;
  user?: (User & { houseRoles: HouseRole[] }) | null;
  onSubmit?(data: z.infer<typeof schema>): void;
}

export function UserForm({ houseId, user, onSubmit }: Props) {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const context = trpc.useContext();
  const addUser = trpc.users.addUser.useMutation({
    onSuccess: () => {
      context.users.getUsersByHouseId.invalidate();
    },
  });
  const editUser = trpc.users.editUser.useMutation({
    onSuccess: () => {
      context.users.getUsersByHouseId.invalidate();
    },
  });
  const deleteUser = trpc.users.deleteUser.useMutation({
    onSuccess: () => {
      context.users.getUsersByHouseId.invalidate();
    },
  });

  const isLoading = addUser.isLoading || editUser.isLoading;

  async function handleDeleteUser() {
    if (!user) return;

    await deleteUser.mutateAsync({ ...user, houseId });
    setDeleteOpen(false);
  }

  async function handleSubmit(data: z.infer<typeof schema>) {
    if (user) {
      await editUser.mutateAsync({
        id: user.id,
        houseId,
        ...data,
      });

      onSubmit?.(data);
    } else {
      await addUser.mutateAsync({
        houseId,
        ...data,
      });

      onSubmit?.(data);
    }
  }

  const role = user && getUserRole(user, houseId)?.role;
  const isOwner = role === UserRole.OWNER;

  const defaultValues = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: role ?? UserRole.USER,
  };

  return (
    <>
      <Form defaultValues={defaultValues} schema={schema} onSubmit={handleSubmit}>
        {({ register }) => (
          <>
            <FormField label="Name">
              <Input disabled={isOwner} {...register("name")} />
            </FormField>

            <FormField label="Email (Google Account)">
              <Input disabled={isOwner} {...register("email")} />
            </FormField>

            <FormField label="House Role">
              <Select disabled={isOwner} {...register("role")}>
                {isOwner ? (
                  <option value={UserRole.OWNER}>{UserRole.OWNER}</option>
                ) : (
                  <>
                    <option value={UserRole.ADMIN}>{UserRole.ADMIN}</option>
                    <option value={UserRole.USER}>{UserRole.USER}</option>
                  </>
                )}
              </Select>
            </FormField>

            <footer
              className={classNames(
                "mt-5 flex",
                user && !isOwner ? "justify-between" : "justify-end",
              )}
            >
              {user && !isOwner ? (
                <Button variant="danger" type="button" onClick={() => setDeleteOpen(true)}>
                  Delete
                </Button>
              ) : null}
              <div className="flex justify-end gap-2">
                <Modal.Close>
                  <Button disabled={isLoading} type="reset">
                    Cancel
                  </Button>
                </Modal.Close>
                <Button
                  className="flex items-center gap-2"
                  disabled={isOwner || isLoading}
                  type="submit"
                >
                  {isLoading ? <Loader size="sm" /> : null}
                  {user ? "Save Changes" : "Add new user"}
                </Button>
              </div>
            </footer>
          </>
        )}
      </Form>

      <Modal isOpen={isDeleteOpen} onOpenChange={() => setDeleteOpen(false)}>
        <form onSubmit={handleDeleteUser}>
          <Modal.Title>Delete User</Modal.Title>
          <Modal.Description>
            Are you sure you want to delete this user? This action cannot be undone.
          </Modal.Description>

          <footer className="mt-5 flex justify-end gap-3">
            <Modal.Close>
              <Button disabled={deleteUser.isLoading} type="reset">
                Nope, Cancel
              </Button>
            </Modal.Close>
            <Button
              className="flex items-center gap-2"
              disabled={deleteUser.isLoading}
              variant="danger"
              type="submit"
            >
              {deleteUser.isLoading ? <Loader size="sm" /> : null}
              Yes, delete user
            </Button>
          </footer>
        </form>
      </Modal>
    </>
  );
}

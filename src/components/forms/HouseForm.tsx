import * as React from "react";
import type { House } from "@prisma/client";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { Modal } from "components/modal/Modal";
import { Button } from "components/ui/Button";
import { Loader } from "components/ui/Loader";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { FormFooter } from "components/form/FormFooter";

const schema = z.object({
  name: z.string().min(2),
});

interface Props {
  house?: House | null;
  onSubmit?(data: { name: string }): void;
}

export function HouseForm({ house, onSubmit }: Props) {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const context = trpc.useContext();
  const addHouse = trpc.useMutation(["houses.addHouse"], {
    onSuccess: () => {
      context.invalidateQueries(["houses.getUserHouses"]);
      context.invalidateQueries(["houses.getHouseById"]);
    },
  });
  const editHouse = trpc.useMutation(["houses.editHouse"], {
    onSuccess: () => {
      context.invalidateQueries(["houses.getUserHouses"]);
      context.invalidateQueries(["houses.getHouseById"]);
    },
  });
  const deleteHouse = trpc.useMutation(["houses.deleteHouse"], {
    onSuccess: () => {
      context.invalidateQueries(["houses.getUserHouses"]);
      context.invalidateQueries(["houses.getHouseById"]);
    },
  });

  const isLoading = addHouse.isLoading || editHouse.isLoading;

  async function handleDeleteHouse() {
    if (!house) return;

    await deleteHouse.mutateAsync({ id: house.id });
    setDeleteOpen(false);
  }

  async function handleSubmit(data: { name: string }) {
    if (house) {
      await editHouse.mutateAsync({
        id: house.id,
        ...data,
      });

      onSubmit?.(data);
    } else {
      await addHouse.mutateAsync(data);

      onSubmit?.(data);
    }
  }

  return (
    <Form defaultValues={{ name: house?.name ?? "" }} schema={schema} onSubmit={handleSubmit}>
      {({ register }) => (
        <>
          <FormField label="House name">
            <Input {...register("name")} />
          </FormField>

          <FormFooter
            isLoading={isLoading}
            item={house}
            onDeleteClick={() => setDeleteOpen(true)}
            submitText={house ? "Save Changes" : "Add new house"}
          />

          <Modal isOpen={isDeleteOpen} onOpenChange={() => setDeleteOpen(false)}>
            <form onSubmit={handleDeleteHouse}>
              <Modal.Title>Delete House</Modal.Title>
              <Modal.Description>
                Are you sure you want to delete this house? This action cannot be undone.
              </Modal.Description>

              <footer className="mt-5 flex justify-end gap-3">
                <Modal.Close>
                  <Button disabled={deleteHouse.isLoading} type="reset">
                    Nope, Cancel
                  </Button>
                </Modal.Close>
                <Button
                  className="flex items-center gap-2"
                  disabled={deleteHouse.isLoading}
                  variant="danger"
                  type="submit"
                >
                  {deleteHouse.isLoading ? <Loader size="sm" /> : null}
                  Yes, delete house
                </Button>
              </footer>
            </form>
          </Modal>
        </>
      )}
    </Form>
  );
}

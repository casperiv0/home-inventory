import * as React from "react";
import type { House } from "@prisma/client";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { FormFooter } from "components/form/FormFooter";
import { DeletionModal } from "components/modal/DeletionModal";

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

          <DeletionModal
            isLoading={deleteHouse.isLoading}
            isOpen={isDeleteOpen}
            onOpenChange={() => setDeleteOpen(false)}
            onConfirmDeleteClick={handleDeleteHouse}
            text={{
              title: "Delete House",
              description:
                "Are you sure you want to delete this house? This action cannot be undone.",
              yes: "Yes, delete house",
            }}
          />
        </>
      )}
    </Form>
  );
}

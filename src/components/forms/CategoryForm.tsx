import * as React from "react";
import type { Category } from "@prisma/client";
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
  houseId: string;
  category?: Category | null;
  onSubmit?(data: z.infer<typeof schema>): void;
}

export function CategoryForm({ houseId, category, onSubmit }: Props) {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const context = trpc.useContext();
  const addCategory = trpc.useMutation(["categories.addCategory"], {
    onSuccess: () => {
      context.invalidateQueries(["categories.getCategoriesByHouseId"]);
    },
  });
  const editCategory = trpc.useMutation(["categories.editCategory"], {
    onSuccess: () => {
      context.invalidateQueries(["categories.getCategoriesByHouseId"]);
    },
  });
  const deleteCategory = trpc.useMutation(["categories.deleteCategory"], {
    onSuccess: () => {
      context.invalidateQueries(["categories.getCategoriesByHouseId"]);
    },
  });

  const isLoading = addCategory.isLoading || editCategory.isLoading;

  async function handleDeleteCategory() {
    if (!category) return;

    await deleteCategory.mutateAsync({ ...category, houseId });
    setDeleteOpen(false);
  }

  async function handleSubmit(data: z.infer<typeof schema>) {
    if (category) {
      await editCategory.mutateAsync({
        id: category.id,
        houseId,
        ...data,
      });

      onSubmit?.(data);
    } else {
      await addCategory.mutateAsync({
        houseId,
        ...data,
      });

      onSubmit?.(data);
    }
  }

  const defaultValues = {
    name: category?.name ?? "",
  };

  return (
    <Form defaultValues={defaultValues} schema={schema} onSubmit={handleSubmit}>
      {({ register }) => (
        <>
          <FormField label="name">
            <Input {...register("name")} />
          </FormField>

          <FormFooter
            isLoading={isLoading}
            item={category}
            onDeleteClick={() => setDeleteOpen(true)}
            submitText={category ? "Save Changes" : "Add new category"}
          />

          <DeletionModal
            isLoading={deleteCategory.isLoading}
            isOpen={isDeleteOpen}
            onOpenChange={() => setDeleteOpen(false)}
            onConfirmDeleteClick={handleDeleteCategory}
            text={{
              title: "Delete Category",
              description:
                "Are you sure you want to delete this category? This action cannot be undone.",
              yes: "Yes, delete category",
            }}
          />
        </>
      )}
    </Form>
  );
}

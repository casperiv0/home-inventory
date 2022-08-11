import * as React from "react";
import type { Category } from "@prisma/client";
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

          {/* todo: make it's own component */}
          <Modal isOpen={isDeleteOpen} onOpenChange={() => setDeleteOpen(false)}>
            <form onSubmit={handleDeleteCategory}>
              <Modal.Title>Delete Category</Modal.Title>
              <Modal.Description>
                Are you sure you want to delete this category? This action cannot be undone.
              </Modal.Description>

              <footer className="mt-5 flex justify-end gap-3">
                <Modal.Close>
                  <Button disabled={deleteCategory.isLoading} type="reset">
                    Nope, Cancel
                  </Button>
                </Modal.Close>
                <Button
                  className="flex items-center gap-2"
                  disabled={deleteCategory.isLoading}
                  variant="danger"
                  type="submit"
                >
                  {deleteCategory.isLoading ? <Loader size="sm" /> : null}
                  Yes, delete category
                </Button>
              </footer>
            </form>
          </Modal>
        </>
      )}
    </Form>
  );
}

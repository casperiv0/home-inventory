import * as React from "react";
import type { Product } from "@prisma/client";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { Modal } from "components/modal/Modal";
import { Button } from "components/ui/Button";
import { Loader } from "components/ui/Loader";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { classNames } from "utils/classNames";

const schema = z.object({
  name: z.string().min(2),
  price: z.number().min(1),
  quantity: z.number().min(1),
  expireDate: z.date().or(z.string()).optional().nullable(),
});

interface Props {
  houseId: string;
  product?: Product | null;
  onSubmit?(data: z.infer<typeof schema>): void;
}

export function ProductForm({ houseId, product, onSubmit }: Props) {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const context = trpc.useContext();
  const addProduct = trpc.useMutation(["products.addProduct"], {
    onSuccess: () => {
      context.invalidateQueries(["products.getProductsByHouseId"]);
    },
  });
  const editProduct = trpc.useMutation(["products.editProduct"], {
    onSuccess: () => {
      context.invalidateQueries(["products.getProductsByHouseId"]);
    },
  });
  const deleteProduct = trpc.useMutation(["products.deleteProduct"], {
    onSuccess: () => {
      context.invalidateQueries(["products.getProductsByHouseId"]);
    },
  });

  const isLoading = addProduct.isLoading || editProduct.isLoading;

  async function handleDeleteProduct() {
    if (!product) return;

    await deleteProduct.mutateAsync({ id: product.id, houseId });
    setDeleteOpen(false);
  }

  async function handleSubmit(data: z.infer<typeof schema>) {
    if (product) {
      await editProduct.mutateAsync({
        id: product.id,
        houseId,
        ...data,
      });

      onSubmit?.(data);
    } else {
      await addProduct.mutateAsync({
        houseId,
        ...data,
      });

      onSubmit?.(data);
    }
  }

  const expirationDate = product?.expirationDate
    ? new Date(product.expirationDate).toISOString().slice(0, 10)
    : null;

  const defaultValues = {
    name: product?.name ?? "",
    price: product?.price ?? 0,
    quantity: product?.quantity ?? 0,
    expireDate: expirationDate,
    warnOnQuantity: product?.warnOnQuantity ?? 2,
    ignoreQuantityWarning: product?.ignoreQuantityWarning ?? false,
    createdAt: product?.createdAt ?? "",
    category: product?.categoryId ?? "",
  };

  return (
    <Form defaultValues={defaultValues} schema={schema} onSubmit={handleSubmit}>
      {({ register, getValues }) => (
        <>
          {console.log(getValues())}
          <FormField label="name">
            <Input {...register("name")} />
          </FormField>

          <div className="flex items-center justify-between gap-1">
            <FormField label="Price">
              <Input
                className="font-mono"
                placeholder="€"
                {...register("price", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Quantity">
              <Input className="font-mono" {...register("quantity", { valueAsNumber: true })} />
            </FormField>
          </div>

          <FormField optional label="Expire Date">
            <Input type="date" {...register("expireDate", { valueAsDate: true })} />
          </FormField>

          <footer className={classNames("mt-5 flex", product ? "justify-between" : "justify-end")}>
            {product ? (
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
              <Button className="flex items-center gap-2" disabled={isLoading} type="submit">
                {isLoading ? <Loader size="sm" /> : null}
                {product ? "Save Changes" : "Add new product"}
              </Button>
            </div>
          </footer>

          <Modal isOpen={isDeleteOpen} onOpenChange={() => setDeleteOpen(false)}>
            <form onSubmit={handleDeleteProduct}>
              <Modal.Title>Delete Product</Modal.Title>
              <Modal.Description>
                Are you sure you want to delete this product? This action cannot be undone.
              </Modal.Description>

              <footer className="mt-5 flex justify-end gap-3">
                <Modal.Close>
                  <Button disabled={deleteProduct.isLoading} type="reset">
                    Nope, Cancel
                  </Button>
                </Modal.Close>
                <Button
                  className="flex items-center gap-2"
                  disabled={deleteProduct.isLoading}
                  variant="danger"
                  type="submit"
                >
                  {deleteProduct.isLoading ? <Loader size="sm" /> : null}
                  Yes, delete product
                </Button>
              </footer>
            </form>
          </Modal>
        </>
      )}
    </Form>
  );
}

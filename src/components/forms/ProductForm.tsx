import * as React from "react";
import type { Product, User } from "@prisma/client";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { Modal } from "components/modal/Modal";
import { Button } from "components/ui/Button";
import { Loader } from "components/ui/Loader";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { classNames } from "utils/classNames";
import { Select } from "components/form/Select";

const schema = z.object({
  name: z.string().min(2),
  price: z.number().min(1),
  quantity: z.number().min(1),
  expireDate: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  category: z.string().nullable().optional(),
  ignoreQuantityWarning: z.boolean().optional().nullable(),
});

interface Props {
  houseId: string;
  product?: (Product & { createdBy: User }) | null;
  onSubmit?(data: z.infer<typeof schema>): void;
}

export function ProductForm({ houseId, product, onSubmit }: Props) {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const categoriesQuery = trpc.useQuery([
    "categories.getCategoriesByHouseId",
    { houseId, page: 0 },
  ]);

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

  const createdAt = product?.createdAt
    ? new Date(product.createdAt).toISOString().slice(0, 10)
    : null;

  const defaultValues = {
    name: product?.name ?? "",
    price: product?.price ?? 0,
    quantity: product?.quantity ?? 0,
    expireDate: expirationDate,
    warnOnQuantity: product?.warnOnQuantity ?? 2,
    ignoreQuantityWarning: product?.ignoreQuantityWarning ?? false,
    createdAt,
    category: product?.categoryId ?? null,
  };

  return (
    <Form defaultValues={defaultValues} schema={schema} onSubmit={handleSubmit}>
      {({ register, errors }) => (
        <>
          <FormField errorMessage={errors.name} label="name">
            <Input {...register("name")} />
          </FormField>

          <div className="flex items-center justify-between gap-1">
            <FormField errorMessage={errors.price} label="Price">
              <Input
                className="font-mono"
                placeholder="€"
                {...register("price", { valueAsNumber: true })}
              />
            </FormField>

            <FormField errorMessage={errors.quantity} label="Quantity">
              <Input className="font-mono" {...register("quantity", { valueAsNumber: true })} />
            </FormField>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <FormField errorMessage={errors.expireDate} optional label="Expire Date">
              <Input type="date" {...register("expireDate")} />
            </FormField>

            <FormField errorMessage={errors.createdAt} optional label="Created Date">
              <Input type="date" {...register("createdAt")} />
            </FormField>
          </div>

          <FormField errorMessage={errors.category} optional label="Category">
            <Select {...register("category")}>
              <option value="">None</option>
              {categoriesQuery.data?.items.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField checkbox label="Ignore quantity warning">
            <Input {...register("ignoreQuantityWarning")} type="checkbox" />
          </FormField>

          {product ? (
            <>
              <hr className="h-[3px] my-4 mt-6 bg-neutral-700 rounded-md" />

              <div className="flex flex-col md:flex-row gap-2">
                <FormField label="Created by">
                  <Input disabled defaultValue={product.createdBy.name} />
                </FormField>

                <FormField label="Last Updated At">
                  <Input disabled defaultValue={product.updatedAt.toDateString()} />
                </FormField>
              </div>
            </>
          ) : null}

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

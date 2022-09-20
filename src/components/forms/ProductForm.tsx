import * as React from "react";
import type { Product, User } from "@prisma/client";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { Select } from "components/form/Select";
import { FormFooter } from "components/form/FormFooter";
import { DeletionModal } from "components/modal/DeletionModal";
import { Textarea } from "components/form/Textarea";

const schema = z.object({
  name: z.string().min(2),
  price: z
    .any()
    .refine((arg) => ([null, undefined, "", "0", 0].includes(arg) ? "null" : parseInt(arg, 10)))
    .nullable(),
  quantity: z.number().min(1),
  expireDate: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  category: z.string().nullable().optional(),
  ignoreQuantityWarning: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
});

interface Props {
  houseId: string;
  product?: (Product & { createdBy: User }) | null;
  onSubmit?(data: z.infer<typeof schema>): void;
}

export function ProductForm({ houseId, product, onSubmit }: Props) {
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const categoriesQuery = trpc.categories.getCategoriesByHouseId.useQuery({ houseId, page: 0 });

  const context = trpc.useContext();
  const addProduct = trpc.products.addProduct.useMutation({
    onSuccess: () => {
      context.products.getProductsByHouseId.invalidate();
    },
  });
  const editProduct = trpc.products.editProduct.useMutation({
    onSuccess: () => {
      context.products.getProductsByHouseId.invalidate();
    },
  });
  const deleteProduct = trpc.products.deleteProduct.useMutation({
    onSuccess: () => {
      context.products.getProductsByHouseId.invalidate();
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
    description: product?.description ?? "",
  };

  return (
    <Form defaultValues={defaultValues} schema={schema} onSubmit={handleSubmit}>
      {({ register, errors }) => (
        <>
          <FormField errorMessage={errors.name} label="Name">
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

          <FormField errorMessage={errors.description} optional label="Description">
            <Textarea {...register("description")} />
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

          <FormFooter
            isLoading={isLoading}
            item={product}
            onDeleteClick={() => setDeleteOpen(true)}
            submitText={product ? "Save Changes" : "Add new product"}
          />

          <DeletionModal
            isLoading={deleteProduct.isLoading}
            isOpen={isDeleteOpen}
            onOpenChange={() => setDeleteOpen(false)}
            onConfirmDeleteClick={handleDeleteProduct}
            text={{
              title: "Delete Product",
              description:
                "Are you sure you want to delete this product? This action cannot be undone.",
              yes: "Yes, delete product",
            }}
          />
        </>
      )}
    </Form>
  );
}

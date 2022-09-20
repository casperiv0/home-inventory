import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { FormFooter } from "components/form/FormFooter";
import { Input } from "components/form/Input";
import { useHouseById } from "hooks/queries/useHouse";
import { trpc } from "utils/trpc";

export function ImportProductsForm() {
  const { house } = useHouseById();
  const context = trpc.useContext();
  const importProductsMutation = trpc.products.importProductsFromFile.useMutation({
    onSuccess: () => context.products.getProductsByHouseId.invalidate(),
  });

  if (!house) {
    return null;
  }

  async function handleSubmit(data: { file: FileList | undefined }) {
    const file = data.file?.item(0);
    if (!file || !house) return;

    const fileData = await file.text();
    importProductsMutation.mutateAsync({ houseId: house.id, file: fileData });
  }

  return (
    <Form defaultValues={{ file: undefined }} onSubmit={handleSubmit}>
      {({ register }) => (
        <>
          <FormField label="File">
            <Input {...register("file")} type="file" />
          </FormField>

          <FormFooter
            isLoading={false}
            // item={category}
            submitText="Import Products"
          />
        </>
      )}
    </Form>
  );
}

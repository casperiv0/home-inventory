import { Button } from "components/ui/Button";
import { Form } from "components/form/Form";
import { FormField } from "components/form/FormField";
import { Input } from "components/form/Input";
import { Select } from "components/form/Select";
import { Textarea } from "components/form/Textarea";
import { Loader } from "components/ui/Loader";
import type { TableFilter } from "./TableFilters";

interface Props {
  filter: TableFilter;
  isRemovable?: boolean;
  isLoading?: boolean;
  handleFiltersSubmit(filter: any): void;
  handleRemoveFilter(filter: TableFilter): void;
}

export function TableFilterForms({
  filter,
  isRemovable,
  isLoading,
  handleFiltersSubmit,
  handleRemoveFilter,
}: Props) {
  const filterName = filter.name;
  const filterOptions = filter.options ?? [];
  const filterType = filter.filterType;

  const defaultValues = {
    filterType,
    type: filter.type ? filter.type : "equals",
    content: filter.content ? filter.content : "",
    name: filterName,
    options: filterOptions,
  };

  return (
    <div className="p-3">
      <Form defaultValues={defaultValues} onSubmit={handleFiltersSubmit}>
        {({ register, setValue }) => (
          <>
            {filterType === "enum" ? (
              <div>
                <h3 className="font-serif font-semibold text-lg mb-3">Select Filter</h3>

                <FormField label="Equals">
                  <Select {...register("content", { required: true })}>
                    {filterOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
            ) : null}

            {filterType === "number" ? (
              <div className="mb-3">
                <h3 className="font-serif font-semibold text-lg mb-3">Number Filter</h3>

                <FormField checkbox label="Equals">
                  <Input value="equals" className="w-10" type="radio" {...register("type")} />
                </FormField>
                <FormField checkbox label="Less than">
                  <Input value="lt" className="w-10" type="radio" {...register("type")} />
                </FormField>
                <FormField checkbox label="Greater than">
                  <Input value="gt" className="w-10" type="radio" {...register("type")} />
                </FormField>

                <Input
                  className="font-mono"
                  placeholder="0"
                  {...register("content", { required: true, valueAsNumber: true })}
                />
              </div>
            ) : null}

            {filterType === "string" ? (
              <div className="mb-3">
                <h3 className="font-serif font-semibold text-lg mb-3">Text Filter</h3>

                <FormField checkbox label="Equals">
                  <Input value="equals" className="w-10" type="radio" {...register("type")} />
                </FormField>
                <FormField checkbox label="Contains">
                  <Input value="contains" className="w-10" type="radio" {...register("type")} />
                </FormField>

                <FormField label="Content">
                  <Textarea
                    placeholder="Hello world"
                    {...register("content", { required: true })}
                  />
                </FormField>
              </div>
            ) : null}

            <div>
              <Button
                onClick={() => {
                  setValue("filterType", filterType);
                  setValue("name", filterName);
                }}
                type="submit"
                className="font-medium w-full flex items-center justify-center gap-2"
                variant="accent"
                disabled={isLoading}
              >
                {isLoading ? <Loader size="sm" /> : null}
                Apply filter
              </Button>
              {isRemovable ? (
                <Button
                  onClick={() => handleRemoveFilter(filter)}
                  type="reset"
                  className="font-medium w-full mt-2"
                  disabled={isLoading}
                >
                  Remove filter
                </Button>
              ) : null}
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

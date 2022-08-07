import * as React from "react";
import {
  DeepPartial,
  DeepRequired,
  FieldErrorsImpl,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

interface Form<Values extends FieldValues> extends UseFormReturn<Values> {
  errors: FieldErrorsImpl<DeepRequired<Values>>;
}

interface Props<Values extends FieldValues> extends Omit<UseFormProps, "defaultValues"> {
  children(form: Form<Values>): React.ReactNode;
  schema?: z.Schema<any, any>;
  defaultValues: DeepPartial<Values>;
  onSubmit: SubmitHandler<Values>;
}

export function Form<Values extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  ...rest
}: Props<Values>) {
  const form = useForm<Values>({
    ...rest,
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
    reValidateMode: "onChange",
  });

  const errors = form.formState.errors;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

      if (!["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [form, onSubmit]);

  return <form onSubmit={form.handleSubmit(onSubmit)}>{children({ ...form, errors })}</form>;
}

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

interface Props<FormValues extends FieldValues>
  extends Omit<UseFormProps, "defaultValues" | "values"> {
  children(form: Form<FormValues>): React.ReactNode;
  schema?: z.Schema<any, any>;
  defaultValues: DeepPartial<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
}

export function Form<FormValues extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  ...rest
}: Props<FormValues>) {
  const form = useForm<FormValues>({
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

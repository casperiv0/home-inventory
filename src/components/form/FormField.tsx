import * as React from "react";
import { useField } from "@react-aria/label";
import { classNames } from "utils/classNames";
import type { FieldError } from "react-hook-form";

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
  checkbox?: boolean;
  errorMessage?: FieldError;

  /** make a form field as optional */
  optional?: boolean;
}

export function FormField({ checkbox, children, label, className, errorMessage, optional }: Props) {
  const { labelProps, fieldProps, errorMessageProps } = useField({
    label,
    errorMessage: errorMessage?.message,
  });

  const labelClassnames = classNames("mb-1 font-medium", checkbox && "ml-2 w-full");
  const [child, ...rest] = Array.isArray(children) ? children : [children];

  const checkboxProps = checkbox ? { className: "max-w-[20px]" } : {};

  const isInput =
    ["__Input__", "__Textarea__"].includes(child?.type?.displayName) ||
    child?.type?.name === "Select";
  const inputProps = isInput ? { errorMessage } : {};

  const element = React.cloneElement(child as React.ReactElement, {
    ...fieldProps,
    ...inputProps,
    ...checkboxProps,
  });

  return (
    <div className={classNames("flex flex-col mb-3", className)}>
      <div
        className={classNames("flex", checkbox ? "flex-row items-center" : "flex-col", className)}
      >
        {!checkbox ? (
          <label {...labelProps} className={labelClassnames}>
            {label} {optional ? <span className="text-sm italic">(Optional)</span> : null}
          </label>
        ) : null}

        {element}
        {rest}

        {checkbox ? (
          <label {...labelProps} className={labelClassnames}>
            {label}
          </label>
        ) : null}
      </div>

      {errorMessage?.message ? (
        <span {...errorMessageProps} className="mt-1 font-medium text-red-500">
          {errorMessage.message}
        </span>
      ) : null}
    </div>
  );
}

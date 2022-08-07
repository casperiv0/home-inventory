import * as React from "react";
import { classNames } from "utils/classNames";
import { twMerge } from "tailwind-merge";

type Props = Omit<JSX.IntrinsicElements["select"], "id"> & {
  errorMessage?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ errorMessage, children, ...rest }, ref) => (
    <select
      {...rest}
      ref={ref}
      className={classNames(
        twMerge(
          "border-[1.5px] focus:border-accent",
          "w-full p-1.5 px-2 rounded-sm outline-none transition-all",
          "bg-secondary text-white",
          "disabled:cursor-not-allowed disabled:opacity-80 placeholder:opacity-50",
          rest.className,
          errorMessage ? "border-red-500 focus:border-red-700" : "border-gray-600",
        ),
      )}
    >
      {children}
    </select>
  ),
);

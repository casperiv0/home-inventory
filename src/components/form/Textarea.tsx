import * as React from "react";
import { twMerge } from "tailwind-merge";
import { classNames } from "utils/classNames";

type Props = Omit<JSX.IntrinsicElements["textarea"], "id"> & {
  errorMessage?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ errorMessage, ...rest }, ref) => (
    <textarea
      ref={ref}
      {...rest}
      className={classNames(
        twMerge(
          "border-[1.5px] focus:border-accent",
          "w-full p-1.5 px-3 rounded-sm outline-none transition-all",
          "bg-secondary",
          "disabled:cursor-not-allowed disabled:opacity-80 placeholder:opacity-50",
          rest.className,
          errorMessage ? "border-red-500 focus:border-red-700" : "border-gray-600",
        ),
      )}
    />
  ),
);

import * as React from "react";
import { twMerge } from "tailwind-merge";
import { classNames } from "../../utils/classNames";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  size?: keyof typeof buttonSizes;
  variant?: keyof typeof buttonVariants | null;
};

export const buttonVariants = {
  default: "bg-neutral-700 enabled:hover:brightness-110 transition shadow-sm text-white",
  dropdown: "bg-neutral-800/60 enabled:hover:bg-neutral-800 transition shadow-sm text-white",
  danger: "bg-red-800 enabled:hover:bg-red-700 transition shadow-sm text-white",
  transparent: "bg-transparent transition text-neutral-700",
};

export const buttonSizes = {
  xxs: "p-0.5 px-1.5 text-[0.95rem]",
  xs: "p-0.5 px-2",
  sm: "p-[3px] px-3",
  lg: "p-2 px-6",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "sm", className = "", ...rest }, ref) => (
    <button
      className={classNames(
        twMerge(
          "rounded-sm transition-all border-[1.5px] border-transparent",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          buttonSizes[size],
          variant && buttonVariants[variant],
          className,
        ),
      )}
      {...rest}
      ref={ref}
    />
  ),
);

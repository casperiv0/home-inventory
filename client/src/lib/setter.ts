import React from "react";

type Set<T> = React.Dispatch<React.SetStateAction<T>>;
type ChangeEvent<I> = React.ChangeEvent<I>;

export const setter =
  <T, I = HTMLInputElement>(setX: Set<T>) =>
  (e: ChangeEvent<I>) => {
    const value = (e.target as any).value;

    setX(value as T);
  };

import type * as React from "react";

type Set<T> = React.Dispatch<React.SetStateAction<T>>;
type ChangeEvent<E> = React.ChangeEvent<E>;
type Input = HTMLInputElement | HTMLTextAreaElement;

export function setter<T extends number | string | Date, E extends Input = HTMLInputElement>(
  setX: Set<T>,
) {
  return function setterInner(e: ChangeEvent<E>) {
    setX(e.target.value as T);
  };
}

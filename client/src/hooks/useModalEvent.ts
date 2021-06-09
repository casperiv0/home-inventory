/**
 * https://github.com/Dev-CasperTheGhost/notey.app/blob/main/src/hooks/useModalEvent.ts
 */

import { useWindowEvent } from "@casper124578/useful";
import * as React from "react";

function useModalEvent<T extends Element = HTMLInputElement>(id: string) {
  const ref = React.useRef<T>(null);
  useWindowEvent("modalOpen", handler);

  function handler(e: Event) {
    if ((e as CustomEvent).detail === id) {
      //  @ts-expect-error ignore line below
      ref.current?.focus?.();
    }
  }

  return ref;
}

export default useModalEvent;

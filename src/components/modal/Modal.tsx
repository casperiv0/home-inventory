import type * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "components/ui/Button";
import { X } from "react-bootstrap-icons";

interface Props {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?(value: boolean): void;
}

export function Modal({ children, isOpen, onOpenChange }: Props) {
  return (
    <Dialog.Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-40 fixed inset-0 bg-neutral-500/50 modal-overlay" />
        <Dialog.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          className="z-50 rounded-sm bg-neutral-100 drop-shadow-2xl p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] max-h-[85vh] modal-content"
        >
          {children}

          <Dialog.Close asChild>
            <Button size="xs" className="absolute top-4 right-4">
              <X className="w-5 h-5" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Dialog>
  );
}

Modal.Title = ({ children }: { children: React.ReactNode }) => (
  <Dialog.Title className="text-2xl font-serif mb-3 font-semibold">{children}</Dialog.Title>
);

Modal.Description = ({ children }: { children: React.ReactNode }) => (
  <Dialog.Description className="text-base my-3 mb-5 text-neutral-700 w-[90%]">
    {children}
  </Dialog.Description>
);

Modal.Close = ({ children }: { children: React.ReactNode }) => (
  <Dialog.Close asChild>{children}</Dialog.Close>
);

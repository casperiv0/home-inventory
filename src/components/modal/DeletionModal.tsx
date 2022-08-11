import { Button } from "components/ui/Button";
import { Loader } from "components/ui/Loader";
import { Modal } from "./Modal";

interface Props {
  isOpen: boolean;
  isLoading: boolean;

  text: { title: string; description: string; yes: string };

  onConfirmDeleteClick(): void;
  onOpenChange(value: boolean): void;
}

export function DeletionModal({
  isOpen,
  isLoading,
  text,
  onConfirmDeleteClick,
  onOpenChange,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <form onSubmit={onConfirmDeleteClick}>
        <Modal.Title>{text.title}</Modal.Title>
        <Modal.Description>{text.description}</Modal.Description>

        <footer className="mt-5 flex justify-end gap-3">
          <Modal.Close>
            <Button disabled={isLoading} type="reset">
              Nope, Cancel
            </Button>
          </Modal.Close>
          <Button
            className="flex items-center gap-2"
            disabled={isLoading}
            variant="danger"
            type="submit"
          >
            {isLoading ? <Loader size="sm" /> : null}
            {text.yes}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}

import { Modal } from "components/modal/Modal";
import { Button } from "components/ui/Button";
import { Loader } from "components/ui/Loader";
import { classNames } from "utils/classNames";

interface Props<T> {
  item: T | null;
  isLoading?: boolean;
  submitText: string;

  onDeleteClick(): void;
}

export function FormFooter<T>({ isLoading, submitText, item, onDeleteClick }: Props<T>) {
  return (
    <footer
      className={classNames(
        "mt-5 flex flex-col md:flex-row",
        item ? "justify-between" : "justify-end",
      )}
    >
      {item ? (
        <Button className="mb-2 md:mb-0" variant="danger" type="button" onClick={onDeleteClick}>
          Delete
        </Button>
      ) : null}

      <div className="flex flex-col md:flex-row justify-end gap-2">
        <Modal.Close>
          <Button disabled={isLoading} type="reset">
            Cancel
          </Button>
        </Modal.Close>
        <Button
          className="flex items-center justify-center gap-2"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? <Loader size="sm" /> : null}
          {submitText}
        </Button>
      </div>
    </footer>
  );
}

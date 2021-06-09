import * as React from "react";
import { createPortal } from "react-dom";
import { useMounted, usePortal } from "@casper124578/useful/hooks";
import styles from "./modal.module.scss";
import { ModalIds } from "@t/ModalIds";
import { closeModal } from "@lib/modal";

interface Props {
  id: ModalIds;
  title: string;
  width?: string;
  [key: string]: unknown;
}

export const Modal: React.FC<Props> = ({ id, title, children, ...rest }) => {
  const portalRef = usePortal(`Modal_Portal_${id}`);
  const isMounted = useMounted();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal(id);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [id]);

  const handleOuterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains("modal")) {
      closeModal(id);
    }
  };

  return isMounted
    ? createPortal(
        <div
          className={[styles.modalContainer, "modal"].join(" ")}
          onClick={handleOuterClick}
          id={id}
        >
          <div
            style={{ width: rest.width ?? "600px" }}
            className={styles.modalContent}
            id={`style-${id}`}
          >
            <div>
              <header className={styles.modalHeader}>
                {title}

                {/* todo: setup this icon */}
                {/* <CloseModal onClick={() => closeModal(id)}>&times;</CloseModal> */}
              </header>
              <div className={styles.modalBody}>{children}</div>
            </div>
          </div>
        </div>,
        portalRef!,
      )
    : null;
};

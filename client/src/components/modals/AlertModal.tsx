import * as React from "react";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "@components/Modal/modal.module.scss";
import useModalEvent from "@hooks/useModalEvent";

interface Props {
  id: ModalIds;
  title: string;
  description: string | React.ReactFragment;

  actions: ModalAction[];
  width?: string;
}

export interface ModalAction {
  name: string;
  danger?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const AlertModal = (props: Props) => {
  const ref = useModalEvent<HTMLButtonElement>(props.id);

  return (
    <Modal width={props.width ?? "500px"} title={props.title} id={props.id}>
      <p className={styles.alertModalDescription}>{props.description}</p>

      <div className={styles.alertModalActions}>
        {props.actions.map((action, idx) => {
          // spacer
          if (!action.name) return <p key={idx} />;

          return (
            <button
              ref={idx === 0 ? ref : null}
              onClick={action.onClick}
              key={idx}
              className={`btn ${action.danger ? "danger" : ""}`}
            >
              {action.name}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

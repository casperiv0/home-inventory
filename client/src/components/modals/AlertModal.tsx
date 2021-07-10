import * as React from "react";
import { Modal, ModalProps } from "@components/Modal/Modal";
import styles from "@components/Modal/modal.module.scss";
import useModalEvent from "@hooks/useModalEvent";

interface Props extends ModalProps {
  description: string | React.ReactFragment;
  actions: ModalAction[];
}

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface ModalAction extends ButtonProps {
  name: string;
  danger?: boolean;
}

export const AlertModal = (props: Props) => {
  const ref = useModalEvent<HTMLButtonElement>(props.id);

  return (
    <Modal width={props.width ?? "500px"} {...props}>
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
              {...action}
            >
              {action.name}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

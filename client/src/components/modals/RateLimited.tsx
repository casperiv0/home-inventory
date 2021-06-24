import { closeModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import { AlertModal, ModalAction } from "./AlertModal";

export const RateLimitedModal = () => {
  return (
    <AlertModal
      id={ModalIds.AlertRateLimited}
      title="Too many requests!"
      description="You're moving a bit quick there! Please try again in a few minutes."
      actions={[
        {} as ModalAction,
        { name: "OK", onClick: () => closeModal(ModalIds.AlertRateLimited) },
      ]}
      style={{ zIndex: 999 }}
    />
  );
};

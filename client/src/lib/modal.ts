import { ModalIds } from "@t/ModalIds";

/**
 * open a modal and dispatch the `modalOpen` event
 * @param id
 */
export const openModal = (id: ModalIds) => {
  document.querySelector(`#${id}`)?.classList.add("modal-active");
  document.querySelector(`#style-${id}`)?.classList.remove("modal-closed");
  document.querySelector(`#style-${id}`)?.classList.add("modal-content-active");

  // custom event to let the modal know it was opened (for focusing on an input)
  const event = new CustomEvent("modalOpen", {
    detail: id,
  });
  window.dispatchEvent(event);
};

export const closeModal = (id: ModalIds) => {
  document.querySelector(`#style-${id}`)?.classList.replace("modal-content-active", "modal-closed");

  setTimeout(() => {
    document.querySelector(`#${id}`)?.classList.remove("modal-active");
  }, 105);
};

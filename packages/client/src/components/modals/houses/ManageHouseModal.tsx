import * as React from "react";
import { connect } from "react-redux";
import { updateHouseById, deleteHouseById } from "@actions/houses";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import { RequestData } from "@lib/fetch";
import { closeModal, openModal } from "@lib/modal";
import styles from "css/forms.module.scss";
import useModalEvent from "@hooks/useModalEvent";
import { House } from "@t/House";
import { AlertModal } from "@components/modals/AlertModal";
import { setter } from "@lib/setter";

interface Props {
  house: House | null;
  updateHouseById: (id: string, data: RequestData) => Promise<boolean>;
  deleteHouseById: (id: string) => Promise<boolean>;
}

const ManageHouseModal = ({ updateHouseById, deleteHouseById, house }: Props) => {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const ref = useModalEvent(ModalIds.ManageHouse);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!house) return;
    setLoading(true);

    const success = await updateHouseById(house.id, { name });

    if (success) {
      closeModal(ModalIds.ManageHouse);
    }

    setLoading(false);
  }

  async function deleteHouse() {
    if (!house) return;
    const success = await deleteHouseById(house.id);

    if (success) {
      closeModal(ModalIds.AlertDeleteHouse);
      closeModal(ModalIds.ManageHouse);
    }
  }

  React.useEffect(() => {
    if (!house) return;

    setName(house.name);
  }, [house]);

  return (
    <Modal title={`Managing ${house?.name}`} id={ModalIds.ManageHouse}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="manage-house-name">Name</label>
          <input
            ref={ref}
            id="manage-house-name"
            className={styles.formInput}
            value={name}
            onChange={setter(setName)}
          />
        </div>

        <div>
          <button
            onClick={() => openModal(ModalIds.AlertDeleteHouse)}
            type="button"
            className="btn danger"
          >
            Delete house
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={() => closeModal(ModalIds.ManageHouse)}
            className="btn link-btn"
          >
            Cancel
          </button>
          <button disabled={loading} type="submit" className="btn submit">
            {loading ? "updating.." : "Update"}
          </button>
        </div>
      </form>

      <AlertModal
        id={ModalIds.AlertDeleteHouse}
        title="Delete house"
        actions={[
          {
            name: "Cancel",
            onClick: () => closeModal(ModalIds.AlertDeleteHouse),
          },
          {
            name: "Delete",
            onClick: deleteHouse,
            danger: true,
          },
        ]}
        description={
          <>
            Are you sure you want to delete this house and <strong>all</strong> its data? All
            products will be deleted and <strong>cannot</strong> be undone!
          </>
        }
      />
    </Modal>
  );
};

export default connect(null, { updateHouseById, deleteHouseById })(ManageHouseModal);

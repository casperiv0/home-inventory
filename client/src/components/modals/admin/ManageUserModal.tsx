import * as React from "react";
import { connect } from "react-redux";

import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal, openModal } from "@lib/modal";
import { User, UserRole } from "@t/User";
import { Select, SelectValue } from "@components/Select/Select";
import { updateUserById, removeUserFromHouse } from "@actions/admin/users";
import { RequestData } from "@lib/fetch";
import { selectRoles } from "@lib/constants";
import { AlertModal } from "../AlertModal";
import { useHouseId } from "@hooks/useHouseId";
import { getUserRole } from "@utils/getUserRole";

interface Props {
  user: User | null;
  updateUserById: (houseId: string, id: string, data: RequestData) => Promise<boolean>;
  removeUserFromHouse: (houseId: string, id: string) => Promise<boolean>;
}

const ManageUserModal = ({ user, updateUserById, removeUserFromHouse }: Props) => {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isOwner, setOwner] = React.useState(false);

  const houseId = useHouseId();

  React.useEffect(() => {
    if (!user) return;

    setEmail(user.email);
    const userRole = getUserRole(user, houseId);

    if (getUserRole(user, houseId)?.role === UserRole.OWNER) {
      setOwner(true);
    } else {
      setOwner(false);
    }

    if (userRole) {
      setRole({ label: userRole.role, value: userRole.role });
    }
  }, [user, houseId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const success = await updateUserById(houseId, user.id, {
      email,
      role: role?.value,
    });

    if (success) {
      closeModal(ModalIds.ManageUser);
    }

    setLoading(false);
  }

  async function handleRemoveUser() {
    if (!user) return;

    const success = await removeUserFromHouse(houseId, user.id);

    if (success) {
      closeModal(ModalIds.AlertRemoveUser);
      closeModal(ModalIds.ManageUser);
    }
  }

  return (
    <Modal title={`Managing ${user?.name || user?.email}`} id={ModalIds.ManageUser}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="manage-user-email">Email</label>
          <input
            id="manage-user-email"
            type="email"
            className={styles.formInput}
            value={email}
            readOnly
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="manage-user-role">Role</label>

          <Select disabled={isOwner} onChange={setRole} value={role} options={selectRoles} />
        </div>

        {!isOwner ? (
          <div>
            <button
              onClick={() => openModal(ModalIds.AlertRemoveUser)}
              type="button"
              className="btn danger"
            >
              Remove user
            </button>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={() => closeModal(ModalIds.ManageUser)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className="btn submit">
            {loading ? "loading.." : "Update user"}
          </button>
        </div>
      </form>

      {!isOwner ? (
        <AlertModal
          id={ModalIds.AlertRemoveUser}
          title="Delete user"
          description="Are you sure you want to remove this user from this house?"
          actions={[
            {
              name: "Cancel",
              onClick: () => closeModal(ModalIds.AlertRemoveUser),
            },
            {
              name: "Remove user",
              danger: true,
              onClick: handleRemoveUser,
            },
          ]}
        />
      ) : null}
    </Modal>
  );
};

export default connect(null, { updateUserById, removeUserFromHouse })(ManageUserModal);

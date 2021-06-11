import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal, openModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { User, UserRole } from "@t/User";
import { Select, SelectValue } from "@components/Select/Select";
import { updateUserById, deleteUserById } from "@actions/admin/users";
import { RequestData } from "@lib/fetch";
import { selectRoles } from "@lib/constants";
import { AlertModal } from "../AlertModal";

interface Props {
  user: User | null;
  updateUserById: (id: string, data: RequestData) => Promise<boolean>;
  deleteUserById: (id: string) => Promise<boolean>;
}

const ManageUserModal = ({ user, updateUserById, deleteUserById }: Props) => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);

  const ref = useModalEvent(ModalIds.ManageUser);

  React.useEffect(() => {
    if (!user) return;

    setEmail(user.email);
    setName(user.name);
    setRole({ label: user.role, value: user.role });
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const success = await updateUserById(user.id, {
      email,
      role: role?.value,
      name,
    });

    if (success) {
      closeModal(ModalIds.ManageUser);
    }

    setLoading(false);
  }

  async function handleUserDelete() {
    if (!user) return;

    const success = await deleteUserById(user.id);

    if (success) {
      closeModal(ModalIds.AlertDeleteUser);
      closeModal(ModalIds.ManageUser);
    }
  }

  return (
    <Modal title={`Managing ${user?.name || user?.email}`} id={ModalIds.ManageUser}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="manage-user-email">Email</label>
          <input
            ref={ref}
            id="manage-user-email"
            type="email"
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="manage-user-name">Name</label>
          <input
            id="manage-user-name"
            type="text"
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="manage-user-role">Role</label>

          <Select onChange={setRole} value={role} options={selectRoles} />
        </div>

        {user?.role !== UserRole.OWNER ? (
          <div>
            <button
              onClick={() => openModal(ModalIds.AlertDeleteUser)}
              type="button"
              className="btn danger"
            >
              Delete user
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

          <button disabled={loading} type="submit" className={styles.submitBtn}>
            {loading ? "loading.." : "Update user"}
          </button>
        </div>
      </form>

      {user?.role !== UserRole.OWNER ? (
        <AlertModal
          id={ModalIds.AlertDeleteUser}
          title="Delete user"
          description="Are you sure you want to remove this user?"
          actions={[
            {
              name: "Cancel",
              onClick: () => closeModal(ModalIds.AlertDeleteUser),
            },
            {
              name: "Delete",
              danger: true,
              onClick: handleUserDelete,
            },
          ]}
        />
      ) : null}
    </Modal>
  );
};

export default connect(null, { updateUserById, deleteUserById })(ManageUserModal);

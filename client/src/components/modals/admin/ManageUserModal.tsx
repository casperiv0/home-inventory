import * as React from "react";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { User } from "@t/User";
import { Select, SelectValue } from "@components/Select/Select";

interface Props {
  user: User | null;
}

export const ManageUserModal = ({ user }: Props) => {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<SelectValue | null>(null);

  const ref = useModalEvent(ModalIds.ManageUser);

  React.useEffect(() => {
    if (!user) return;

    setEmail(user.email);
    setRole({ label: user.role, value: user.role });
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // todo: add API request
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
          <label htmlFor="manage-user-role">Role</label>

          {/* todo: add options here */}
          <Select onChange={(v) => setRole(v)} value={role} options={[]} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => closeModal(ModalIds.ManageUser)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button type="submit" className={styles.submitBtn}>
            Update user
          </button>
        </div>
      </form>
    </Modal>
  );
};

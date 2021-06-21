import * as React from "react";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { Select, SelectValue } from "@components/Select/Select";
import { selectRoles } from "@lib/constants";
import { RequestData } from "@lib/fetch";
import { connect } from "react-redux";
import { addUser } from "@actions/admin/users";
import { useHouseId } from "@hooks/useHouseId";
import { setter } from "@lib/setter";

interface Props {
  addUser: (houseId: string, data: RequestData) => Promise<boolean>;
}

const AddUserModal = ({ addUser }: Props) => {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);

  const houseId = useHouseId();
  const ref = useModalEvent(ModalIds.AddUser);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await addUser(houseId, { email, role: role?.value });

    if (success) {
      closeModal(ModalIds.AddUser);

      setEmail("");
      setRole(null);
    }

    setLoading(false);
  }

  return (
    <Modal title="Add a new user" id={ModalIds.AddUser}>
      <div className={styles.formGroup}>
        <p>
          Add a new user to have access to this house. This {"user's"} account must exist already.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="add-user-email">Email</label>
          <input
            ref={ref}
            id="add-user-email"
            type="email"
            className={styles.formInput}
            value={email}
            onChange={setter(setEmail)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="add-user-role">Role</label>

          <Select value={role} onChange={setRole} options={selectRoles} />
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
            onClick={() => closeModal(ModalIds.AddUser)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className={styles.submitBtn}>
            {loading ? "loading.." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { addUser })(AddUserModal);

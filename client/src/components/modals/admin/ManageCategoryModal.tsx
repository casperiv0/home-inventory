import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { updateCategoryById, deleteCategoryById } from "@actions/admin/categories";
import { RequestData } from "@lib/fetch";
import { Category } from "@t/Category";

interface Props {
  category: Category | null;
  updateCategoryById: (id: string, data: RequestData) => Promise<boolean>;
  deleteCategoryById: (id: string) => Promise<boolean>;
}

const ManageCategoryModal = ({ category, updateCategoryById, deleteCategoryById }: Props) => {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const ref = useModalEvent(ModalIds.ManageCategory);

  React.useEffect(() => {
    if (!category) return;

    setName(category.name);
  }, [category]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    setLoading(true);

    const success = await updateCategoryById(category.id, {
      name,
    });

    if (success) {
      closeModal(ModalIds.ManageCategory);
    }

    setLoading(false);
  }

  async function handleCategoryDelete() {
    if (!category) return;

    // todo: add custom alertModal
    if (confirm("Are ya sure???")) {
      const success = await deleteCategoryById(category.id);

      if (success) {
        closeModal(ModalIds.ManageCategory);
      }
    }
  }

  return (
    <Modal title={`Managing ${category?.name}`} id={ModalIds.ManageCategory}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="manage-category-name">Name</label>
          <input
            ref={ref}
            id="manage-category-name"
            type="text"
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase())}
          />
        </div>

        <div>
          <button onClick={handleCategoryDelete} type="button" className="btn danger">
            Delete category
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => closeModal(ModalIds.ManageCategory)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className={styles.submitBtn}>
            {loading ? "loading.." : "Update category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { updateCategoryById, deleteCategoryById })(ManageCategoryModal);

import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal, openModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { updateCategoryById, deleteCategoryById } from "@actions/admin/categories";
import { RequestData } from "@lib/fetch";
import { Category } from "@t/Category";
import { AlertModal } from "../AlertModal";
import { useHouseId } from "@hooks/useHouseId";

interface Props {
  category: Category | null;
  updateCategoryById: (houseId: string, id: string, data: RequestData) => Promise<boolean>;
  deleteCategoryById: (houseId: string, id: string) => Promise<boolean>;
}

const ManageCategoryModal = ({ category, updateCategoryById, deleteCategoryById }: Props) => {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const houseId = useHouseId();
  const ref = useModalEvent(ModalIds.ManageCategory);

  React.useEffect(() => {
    if (!category) return;

    setName(category.name);
  }, [category]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    setLoading(true);

    const success = await updateCategoryById(houseId, category.id, {
      name,
    });

    if (success) {
      closeModal(ModalIds.ManageCategory);
    }

    setLoading(false);
  }

  async function handleCategoryDelete() {
    if (!category) return;

    const success = await deleteCategoryById(houseId, category.id);

    if (success) {
      closeModal(ModalIds.ManageCategory);
      closeModal(ModalIds.AlertDeleteCategory);
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
          <button
            onClick={() => openModal(ModalIds.AlertDeleteCategory)}
            type="button"
            className="btn danger"
          >
            Delete category
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

      <AlertModal
        id={ModalIds.AlertDeleteCategory}
        title="Delete category"
        description="Are you sure you want to remove this category?"
        actions={[
          {
            name: "Cancel",
            onClick: () => closeModal(ModalIds.AlertDeleteCategory),
          },
          {
            name: "Delete",
            danger: true,
            onClick: handleCategoryDelete,
          },
        ]}
      />
    </Modal>
  );
};

export default connect(null, { updateCategoryById, deleteCategoryById })(ManageCategoryModal);

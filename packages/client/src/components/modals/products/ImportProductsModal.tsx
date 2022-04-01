import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { importProducts } from "@actions/products";
import { useHouseId } from "@hooks/useHouseId";

interface Props {
  importProducts(houseId: string, file: File): Promise<boolean>;
}

const ImportProductModal = ({ importProducts }: Props) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  const houseId = useHouseId();
  const ref = useModalEvent(ModalIds.ImportProducts);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!file) return;

    const success = await importProducts(houseId, file);

    setLoading(false);

    if (success) {
      closeModal(ModalIds.ImportProducts);

      setFile(null);
      if (ref.current) {
        ref.current.value = "";
      }
    }
  }

  return (
    <Modal title="Import products" id={ModalIds.ImportProducts}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <p>Note: This may take several minutes, depending on your file size.</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="import-product">Name</label>
          <input
            required
            ref={ref}
            id="import-product"
            type="file"
            className={styles.formInput}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            accept=".json"
          />
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
            onClick={() => closeModal(ModalIds.ImportProducts)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading || !file} type="submit" className="btn submit">
            {loading ? "importing.." : "Import"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { importProducts })(ImportProductModal);

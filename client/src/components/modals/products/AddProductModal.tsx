import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { RequestData } from "@lib/fetch";
import { addProduct } from "@actions/products";
import { State } from "@t/State";
import { Category } from "@t/Category";
import { Select, SelectValue } from "@components/Select/Select";

interface Props {
  categories: Category[];
  addProduct: (data: RequestData) => Promise<boolean>;
}

const AddProductModal = ({ addProduct, categories }: Props) => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [expireDate, setExpireDate] = React.useState("");
  const [category, setCategory] = React.useState<SelectValue | null>(null);

  const [loading, setLoading] = React.useState(false);

  const ref = useModalEvent(ModalIds.AddProduct);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await addProduct({
      name,
      price: Number(Number(price).toFixed(2)),
      quantity: Number(quantity),
      expirationDate: expireDate,
      categoryId: category?.value,
    });

    setLoading(false);

    if (success) {
      closeModal(ModalIds.AddProduct);

      setName("");
      setQuantity("");
      setExpireDate("");
      setPrice("");
      setCategory(null);
    }
  }

  return (
    <Modal title="Add a new product" id={ModalIds.AddProduct}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="add-product-name">Name</label>
          <input
            required
            ref={ref}
            id="add-product-name"
            type="text"
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="add-product-price">Price (Euro)</label>
            <input
              id="add-product-price"
              type="text"
              className={styles.formInput}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="add-product-name">Quantity</label>
            <input
              required
              id="add-product-quantity"
              type="number"
              className={styles.formInput}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="add-product-category">Category</label>

          <Select
            value={category}
            onChange={setCategory}
            options={categories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="add-product-expire-date">Expiration Date</label>
          <input
            id="add-product-expire-date"
            type="date"
            className={styles.formInput}
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => closeModal(ModalIds.AddProduct)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className={styles.submitBtn}>
            {loading ? "loading.." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  categories: state.admin.categories,
});

export default connect(mapToProps, { addProduct })(AddProductModal);

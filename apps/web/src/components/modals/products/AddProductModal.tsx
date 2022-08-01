import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import type { RequestData } from "@lib/fetch";
import { addProduct } from "@actions/products";
import type { State } from "@t/State";
import type { Category } from "@t/Category";
import { Select, SelectValue } from "@components/Select/Select";
import { useHouseId } from "@hooks/useHouseId";
import { useRouter } from "next/router";
import { setter } from "@lib/setter";

interface Props {
  currency: string;
  categories: Category[];
  addProduct(houseId: string, data: RequestData): Promise<boolean>;
}

const AddProductModal = ({ addProduct, categories, currency }: Props) => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [expireDate, setExpireDate] = React.useState("");
  const [category, setCategory] = React.useState<SelectValue | null>(null);
  const [warnOnQuantity, setWarnOnQuantity] = React.useState({ value: "2", checked: false });
  const [ignoreQuantityWarning, setIgnoreWarning] = React.useState(false);
  const [createdAt, setCreatedAt] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const houseId = useHouseId();
  const ref = useModalEvent(ModalIds.AddProduct);

  const foundCategory = React.useMemo(() => {
    return categories.find((c) => c.name === router.query.name);
  }, [categories, router.query.name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await addProduct(houseId, {
      name,
      price: Number(Number(price).toFixed(2)),
      quantity: Number(quantity),
      expirationDate: expireDate,
      categoryId: category?.value ?? null,
      warnOnQuantity: warnOnQuantity.checked ? Number(warnOnQuantity.value) : null,
      ignoreQuantityWarning,
      createdAt: createdAt || null,
    });

    setLoading(false);

    if (success) {
      closeModal(ModalIds.AddProduct);

      setName("");
      setQuantity("");
      setExpireDate("");
      setPrice("");
      setCategory(null);
      setIgnoreWarning(false);
      setWarnOnQuantity({ value: "", checked: false });
    }
  }

  React.useEffect(() => {
    if (foundCategory) {
      setCategory({ label: foundCategory.name, value: foundCategory.id });
    }
  }, [foundCategory]);

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
            onChange={setter(setName)}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="add-product-price">Price</label>
            <input
              id="add-product-price"
              type="text"
              className={styles.formInput}
              value={price}
              onChange={setter(setPrice)}
              placeholder={currency}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="add-product-quantity">Quantity</label>
            <input
              required
              id="add-product-quantity"
              type="number"
              className={styles.formInput}
              value={quantity}
              onChange={setter(setQuantity)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="add-product-category">Category (optional)</label>

          <Select
            value={category}
            onChange={setCategory}
            options={categories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="add-product-expire-date">Expiration Date (optional)</label>
            <input
              id="add-product-expire-date"
              type="date"
              className={styles.formInput}
              value={expireDate}
              onChange={setter(setExpireDate)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="add-product-created-at">Created at (optional)</label>
            <input
              id="add-product-created-at"
              type="date"
              className={styles.formInput}
              value={createdAt}
              onChange={setter(setCreatedAt)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formCheckboxGroup}>
            <label htmlFor="custom-warn-quantity">custom {"'warn on quantity'"}</label>
            <input
              id="custom-warn-quantity"
              onChange={() => setWarnOnQuantity((p) => ({ checked: !p.checked, value: p.value }))}
              type="checkbox"
            />
          </div>

          {warnOnQuantity.checked ? (
            <div style={{ marginBottom: "0", marginTop: "1rem" }} className={styles.formGroup}>
              <label htmlFor="add-product-warn-quantity">Warn on quantity</label>
              <input
                autoFocus
                id="add-product-warn-quantity"
                type="number"
                className={styles.formInput}
                value={warnOnQuantity.value}
                onChange={(e) =>
                  setWarnOnQuantity((p) => ({ checked: p.checked, value: e.target.value }))
                }
              />
            </div>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formCheckboxGroup}>
            <label htmlFor="add-product-ignore-quantity-warning">Ignore quantity warning</label>
            <input
              value={`${ignoreQuantityWarning}`}
              id="add-product-ignore-quantity-warning"
              onChange={() => setIgnoreWarning((p) => !p)}
              type="checkbox"
            />
          </div>

          <p style={{ marginTop: "0.5rem" }}>
            When checked, this product will, when low on quantity, <strong>not</strong> show up on
            the home page.
          </p>
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
            onClick={() => closeModal(ModalIds.AddProduct)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className="btn submit">
            {loading ? "loading.." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  categories: state.admin.categories,
  currency: state.houses.house?.currency ?? "€",
});

export default connect(mapToProps, { addProduct })(AddProductModal);

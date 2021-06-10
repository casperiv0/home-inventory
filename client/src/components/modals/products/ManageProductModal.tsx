import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "@t/ModalIds";
import styles from "css/forms.module.scss";
import { closeModal, openModal } from "@lib/modal";
import useModalEvent from "src/hooks/useModalEvent";
import { RequestData } from "@lib/fetch";
import { addProduct } from "@actions/products";
import { State } from "@t/State";
import { Category } from "@t/Category";
import { Select, SelectValue } from "@components/Select/Select";
import { Product } from "@t/Product";
import { AlertModal } from "@components/modals/AlertModal";

interface Props {
  product: Product | null;

  categories: Category[];
  addProduct: (data: RequestData) => Promise<boolean>;
}

const ManageProductModal = ({ addProduct, categories, product }: Props) => {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [expireDate, setExpireDate] = React.useState("");
  const [category, setCategory] = React.useState<SelectValue | null>(null);

  const [loading, setLoading] = React.useState(false);
  const ref = useModalEvent(ModalIds.ManageProduct);

  React.useEffect(() => {
    if (!product) return;

    const foundCategory = categories.find((c) => c.id === product.categoryId);

    if (foundCategory) {
      setCategory({ value: foundCategory.id, label: foundCategory.name });
    }

    setName(product.name);
    setPrice(product.price.toString());
    setQuantity(product.quantity.toString());
    setExpireDate(product.expirationDate ?? "");
  }, [product, categories]);

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
      closeModal(ModalIds.ManageProduct);
      setName("");
    }
  }

  async function handleDeleteProduct() {
    const success = false;

    if (success) {
      closeModal(ModalIds.AlertDeleteProduct);
      closeModal(ModalIds.ManageProduct);
    }
  }

  return (
    <Modal title={`Managing ${product?.name}`} id={ModalIds.ManageProduct}>
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
            <label htmlFor="add-product-price">Price</label>
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
          <label htmlFor="add-product-expire-date">Expiration Date</label>
          <input
            id="add-product-expire-date"
            type="date"
            className={styles.formInput}
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
          />
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

        <div>
          <button
            onClick={() => openModal(ModalIds.AlertDeleteProduct)}
            type="button"
            className="btn danger"
          >
            Delete product
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => closeModal(ModalIds.ManageProduct)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className={styles.submitBtn}>
            {loading ? "updating.." : "Update"}
          </button>
        </div>
      </form>

      <AlertModal
        id={ModalIds.AlertDeleteProduct}
        title="Delete user"
        description="Are you sure you want to remove this product?"
        actions={[
          {
            name: "Cancel",
            onClick: () => closeModal(ModalIds.AlertDeleteProduct),
          },
          {
            name: "Delete",
            danger: true,
            onClick: handleDeleteProduct,
          },
        ]}
      />
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  categories: state.admin.categories,
});

export default connect(mapToProps, { addProduct })(ManageProductModal);

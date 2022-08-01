import * as React from "react";
import { connect, useSelector } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "@t/ModalIds";
import { State } from "@t/State";
import { closeModal } from "@lib/modal";
import form from "css/forms.module.scss";
import { addProductToShoppingList } from "@actions/shopping-list";
import { useHouseId } from "@hooks/useHouseId";

interface Props {
  addProductToShoppingList(houseId: string, productId: string): Promise<boolean>;
}

const AddProductToShoppingListModalC = ({ addProductToShoppingList }: Props) => {
  const [productId, setProductId] = React.useState<SelectValue | null>(null);
  const [loading, setLoading] = React.useState(false);
  const products = useSelector((s: State) => s.products.products);
  const houseId = useHouseId();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);

    const data = await addProductToShoppingList(houseId, productId.value);

    if (data) {
      setProductId(null);
      closeModal(ModalIds.AddProductToShoppingList);
    }

    setLoading(false);
  }

  return (
    <Modal title="Add product to shopping list" id={ModalIds.AddProductToShoppingList}>
      <form onSubmit={onSubmit}>
        <div className={form.formGroup}>
          <label>Select Product</label>

          <Select
            onChange={setProductId}
            options={products.map((product) => ({
              label: product.name,
              value: product.id,
            }))}
          />
        </div>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={() => closeModal(ModalIds.AddProductToShoppingList)}
            className="btn link-btn"
          >
            Cancel
          </button>

          <button disabled={loading} type="submit" className="btn submit">
            {loading ? "loading.." : "Add product"}
          </button>
        </footer>
      </form>
    </Modal>
  );
};

export const AddProductToShoppingListModal = connect(null, { addProductToShoppingList })(
  AddProductToShoppingListModalC,
);

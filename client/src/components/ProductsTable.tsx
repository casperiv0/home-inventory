import * as React from "react";
import ReactToolTip from "react-tooltip";
import format from "date-fns/format";
import { connect, useSelector } from "react-redux";
import Link from "next/link";

import { Product } from "@t/Product";
import { State } from "@t/State";
import { useHouseId } from "@hooks/useHouseId";
import { FilterKeys } from "@lib/constants";
import { closeModal, openModal } from "@lib/modal";
import { AlertModal } from "./modals/AlertModal";
import { ModalIds } from "@t/ModalIds";
import { bulkDeleteProducts } from "@actions/products";

interface Props {
  products: Product[];
  showActions?: boolean;
  currentFilter?: FilterKeys | "expirationDate" | null;

  onManageClick?: (product: Product) => unknown;
  bulkDeleteProducts?: (houseId: string, productIds: string[]) => Promise<boolean>;
}

const ProductsTableC = ({
  products,
  currentFilter,
  showActions,
  onManageClick,
  bulkDeleteProducts,
}: Props) => {
  /**
   * array of product ids that contains selected rows in the table.
   */
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [selectedType, setSelectedType] = React.useState<"ALL" | null>(null);

  const checkboxRef = React.useRef<HTMLInputElement>(null);
  const categories = useSelector((state: State) => state.admin.categories);
  const houseId = useHouseId();

  React.useEffect(() => {
    if (selectedRows.length >= 1 && selectedRows.length === products.length) {
      setSelectedType("ALL");
    } else {
      setSelectedType(null);
    }

    if (checkboxRef.current && selectedRows.length >= 1) {
      checkboxRef.current.indeterminate = selectedRows.length !== products.length;
    }
  }, [selectedRows.length, products?.length]);

  const isRowSelected = React.useCallback(
    (id: string) => selectedRows.includes(id),
    [selectedRows],
  );

  async function handleBulkDelete() {
    setSelectedType(null);
    setSelectedRows([]);

    const success = await bulkDeleteProducts!(houseId, selectedRows);

    if (success) {
      closeModal(ModalIds.AlertDeleteSelectedItems);
    }
  }

  function handleCheckboxChange(productId: string) {
    if (productId === "ALL") {
      if (selectedType === "ALL" && products.length === selectedRows.length) {
        setSelectedType(null);
        setSelectedRows([]);
      } else {
        setSelectedType("ALL");
        setSelectedRows(products.map((p) => p.id));
      }
    } else {
      setSelectedType(null);

      if (isRowSelected(productId)) {
        setSelectedRows((p) => p.filter((v) => v !== productId));
      } else {
        setSelectedRows((p) => [...p, productId]);
      }
    }
  }

  return (
    <>
      <table style={{ marginTop: "1rem" }} className="table">
        <thead>
          <tr>
            {showActions ? (
              <th>
                <input
                  ref={checkboxRef}
                  checked={selectedType === "ALL"}
                  value={(selectedType === "ALL").toString()}
                  onChange={() => handleCheckboxChange("ALL")}
                  type="checkbox"
                />
              </th>
            ) : null}
            <th>Name</th>
            <th>Price</th>
            <th>Total amount</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Category</th>
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isSelected = isRowSelected(product.id);

            /**
             * set the current filter to bold
             */
            const boldText = (str: string) => {
              return currentFilter === str ? "bold" : "";
            };

            const category = categories.find((c) => c.id === product.categoryId);

            const totalPricesAmount = (product.prices ?? [])
              ?.reduce((ac, curr) => ac + curr, 0)
              .toFixed(2);

            return (
              <tr key={product.id}>
                {showActions ? (
                  <td style={{ width: "0.5rem" }}>
                    <input
                      onChange={() => handleCheckboxChange(product.id)}
                      checked={isSelected}
                      value={isSelected.toString()}
                      type="checkbox"
                    />
                  </td>
                ) : null}

                <td className={boldText("name") ? "bold" : ""}>
                  <span data-tip data-for="ProductName">
                    {product.name}
                  </span>

                  <ReactToolTip
                    textColor="var(--dark)"
                    backgroundColor="var(--tooltip-bg)"
                    place="top"
                    id="ProductName"
                    effect="solid"
                    className="tooltip-overwrite"
                  >
                    <p>
                      <strong>Created at: </strong>
                      {format(new Date(product.createdAt), "yyyy-MM-dd")}
                    </p>

                    <p>
                      <strong>Last updated: </strong>
                      {format(new Date(product.updatedAt), "yyyy-MM-dd")}
                    </p>
                  </ReactToolTip>
                </td>
                <td className={boldText("price") || boldText("priceHigh")}>
                  €{product.price.toFixed(2)}
                </td>
                <td>€{totalPricesAmount}</td>
                <td className={boldText("quantity") || boldText("quantityHigh")}>
                  {product.quantity}
                </td>
                <td className={boldText("expirationDate")}>{product.expirationDate ?? "N/A"}</td>
                <td>
                  {product.categoryId && category?.name ? (
                    <Link href={`/${houseId}/category/${category.name}`}>
                      <a className="btn small">{category?.name}</a>
                    </Link>
                  ) : (
                    "None"
                  )}
                </td>

                {showActions ? (
                  <td id="table-actions">
                    <button onClick={() => onManageClick?.(product)} className="btn small">
                      Manage
                    </button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showActions ? (
        <>
          {selectedRows.length > 0 ? (
            <button
              onClick={() => openModal(ModalIds.AlertDeleteSelectedItems)}
              style={{ paddingLeft: "0" }}
              className="btn link-btn"
            >
              Delete {selectedRows.length} items
            </button>
          ) : null}

          <AlertModal
            id={ModalIds.AlertDeleteSelectedItems}
            title="Delete selected items"
            description={
              <>
                Are you sure you want to delete <strong>{selectedRows.length}</strong> selected
                items. This cannot be undone!
              </>
            }
            actions={[
              { name: "Cancel", onClick: () => closeModal(ModalIds.AlertDeleteSelectedItems) },
              { name: "Delete selected", onClick: handleBulkDelete, danger: true },
            ]}
          />
        </>
      ) : null}
    </>
  );
};

export const ProductsTable: React.FC<Props> = connect(null, { bulkDeleteProducts })(ProductsTableC);

import * as React from "react";
import ReactToolTip from "react-tooltip";
import format from "date-fns/format";
import { connect, useSelector } from "react-redux";
import Link from "next/link";

import { Product } from "@t/Product";
import { State } from "@t/State";
import { useHouseId } from "@hooks/useHouseId";
import { FilterKeys, MAX_ITEMS_IN_TABLE } from "@lib/constants";
import { closeModal, openModal } from "@lib/modal";
import { AlertModal } from "./modals/AlertModal";
import { ModalIds } from "@t/ModalIds";
import { bulkDeleteProducts } from "@actions/products";
import { Pagination } from "./Pagination/Pagination";

interface Props {
  products: Product[];
  showActions?: boolean;
  showPagination?: boolean;
  currentFilter?: FilterKeys | "expirationDate" | null;
  currency?: string;

  onManageClick?: (product: Product) => unknown;
  bulkDeleteProducts?: (houseId: string, productIds: string[]) => Promise<boolean>;
}

const ProductsTableC = ({
  products,
  currentFilter,
  showActions,
  showPagination = true,
  currency,
  onManageClick,
  bulkDeleteProducts,
}: Props) => {
  /**
   * array of product ids that contains selected rows in the table.
   */
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [selectedType, setSelectedType] = React.useState<"ALL" | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const checkboxRef = React.useRef<HTMLInputElement>(null);
  const categories = useSelector((state: State) => state.admin.categories);
  const houseId = useHouseId();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = () => {
    const end = currentPage * MAX_ITEMS_IN_TABLE;
    let arr: Product[] = [];

    for (let i = 0; i < products.length; i++) {
      if (i % end === 0) {
        arr = products.slice(end, end + MAX_ITEMS_IN_TABLE);
      } else if (i === 0) {
        arr = products.slice(0, MAX_ITEMS_IN_TABLE);
      }
    }

    return arr;
  };

  React.useEffect(() => {
    setSelectedType(null);
    setSelectedRows([]);
  }, [currentPage]);

  React.useEffect(() => {
    if (selectedRows.length >= 1 && selectedRows.length === list().length) {
      setSelectedType("ALL");
    } else {
      setSelectedType(null);
    }

    if (checkboxRef.current && selectedRows.length >= 1) {
      checkboxRef.current.indeterminate = selectedRows.length !== list().length;
    }
  }, [selectedRows, list]);

  const isRowSelected = React.useCallback(
    (id: string) => selectedRows.includes(id),
    [selectedRows],
  );

  async function handleBulkDelete() {
    setLoading(true);
    const success = await bulkDeleteProducts!(houseId, selectedRows);
    setLoading(false);

    if (success) {
      closeModal(ModalIds.AlertDeleteSelectedItems);

      if (checkboxRef.current) {
        setSelectedType(null);
        setSelectedRows([]);

        checkboxRef.current.indeterminate = false;
      }
    }
  }

  function handleCheckboxChange(productId: string) {
    if (productId === "ALL") {
      if (selectedType === "ALL" && list().length === selectedRows.length) {
        setSelectedType(null);
        setSelectedRows([]);
      } else {
        setSelectedType("ALL");
        setSelectedRows(list().map((p) => p.id));
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
          {list().map((product) => {
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
                  {currency}
                  {product.price.toFixed(2)}
                </td>
                <td>
                  {currency}
                  {totalPricesAmount}
                </td>
                <td className={boldText("quantity") || boldText("quantityHigh")}>
                  {product.quantity}
                </td>
                <td className={boldText("expirationDate")}>{product.expirationDate || "N/A"}</td>
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

      {showPagination ? (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          length={products.length}
        />
      ) : null}
      {showActions ? (
        <>
          {selectedRows.length > 0 ? (
            <button
              onClick={() => openModal(ModalIds.AlertDeleteSelectedItems)}
              style={{ paddingLeft: "0" }}
              className="btn link-btn"
            >
              Delete {selectedRows.length} item{selectedRows.length === 1 ? "" : "s"}
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
              {
                name: loading ? "deleting..." : "Delete selected",
                onClick: handleBulkDelete,
                danger: true,
                disabled: loading,
              },
            ]}
          />
        </>
      ) : null}
    </>
  );
};

const mapToProps = (state: State) => ({
  currency: state.houses.house?.currency ?? "€",
});

export const ProductsTable: React.FC<Props> = connect(mapToProps, {
  bulkDeleteProducts,
})(ProductsTableC);

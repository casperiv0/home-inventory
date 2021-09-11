import * as React from "react";
import { connect, useSelector } from "react-redux";
import format from "date-fns/format";
import Link from "next/link";

import { useHouseId } from "@hooks/useHouseId";
import { MAX_ITEMS_IN_TABLE } from "@lib/constants";
import { Product } from "@t/Product";
import { State } from "@t/State";
import { Pagination } from "@components/Pagination/Pagination";
import styles from "css/views.module.scss";
import { ShoppingListItem } from "@t/ShoppingList";

interface Props {
  products: (Product | ShoppingListItem)[];
  showPagination?: boolean;
  currency?: string;

  showManageButton?: boolean;
  showDeleteButton?: boolean;

  onManageClick?: (product: Product) => unknown;
  onDeleteClick?: (product: ShoppingListItem) => unknown;
  bulkDeleteProducts?: (houseId: string, productIds: string[]) => Promise<boolean>;
}

const ProductsListC = ({
  showManageButton = true,
  showDeleteButton,
  currency,
  products,
  showPagination,
  onManageClick,
  onDeleteClick,
}: Props) => {
  const categories = useSelector((state: State) => state.admin.categories);
  const houseId = useHouseId();

  const [currentPage, setCurrentPage] = React.useState<number>(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = () => {
    const end = currentPage * MAX_ITEMS_IN_TABLE;
    let arr: (Product | ShoppingListItem)[] = [];

    for (let i = 0; i < products.length; i++) {
      if (i % end === 0) {
        arr = products.slice(end, end + MAX_ITEMS_IN_TABLE);
      } else if (i === 0) {
        arr = products.slice(0, MAX_ITEMS_IN_TABLE);
      }
    }

    return arr;
  };

  //   async function handleBulkDelete() {
  //     setLoading(true);
  //     const success = await bulkDeleteProducts!(houseId, selectedRows);
  //     setLoading(false);

  //     if (success) {
  //       closeModal(ModalIds.AlertDeleteSelectedItems);

  //       if (checkboxRef.current) {
  //         setSelectedType(null);
  //         setSelectedRows([]);

  //         checkboxRef.current.indeterminate = false;
  //       }
  //     }
  //   }

  return (
    <>
      <div style={{ marginTop: "1rem" }}>
        <ul className={styles.items}>
          {list().map((item) => {
            const product = "product" in item ? item.product : item;
            const category = categories.find((c) => c.id === product.categoryId);

            const expirationDate = product.expirationDate
              ? format(new Date(product.expirationDate), "yyyy-MM-dd")
              : "N/A";

            return (
              <div className={styles.item} key={product.id}>
                <h1 className={styles.name}>{product.name}</h1>

                <p className={styles.info}>
                  <span>
                    <span className={styles.bold}>Price: </span> {currency}
                    {product.price}
                  </span>

                  <span>
                    <span className={styles.bold}>Total Price: </span> {currency}
                    {product.prices}
                  </span>

                  <span>
                    <span className={styles.bold}>Quantity: </span> {product.quantity}
                  </span>

                  <span>
                    <span className={styles.bold}>Expiration date: </span> {expirationDate}
                  </span>

                  <span>
                    <span className={styles.bold}>Category: </span>
                    {product.categoryId && category ? (
                      <Link href={`/${houseId}/category/${category.name}`}>
                        <a className="btn small submit">{category.name}</a>
                      </Link>
                    ) : (
                      "None"
                    )}
                  </span>
                </p>

                {showManageButton ? (
                  <button onClick={() => onManageClick?.(product)} className="btn submit">
                    Manage
                  </button>
                ) : null}

                {showDeleteButton ? (
                  <button
                    onClick={() => onDeleteClick?.(item as ShoppingListItem)}
                    className="btn danger"
                  >
                    Delete from list
                  </button>
                ) : null}
              </div>
            );
          })}
        </ul>
      </div>

      {showPagination ? (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          length={products.length}
        />
      ) : null}
    </>
  );
};

const mapToProps = (state: State) => ({
  currency: state.houses.house?.currency ?? "€",
});

export const ProductsList: React.FC<Props> = connect(mapToProps)(ProductsListC);

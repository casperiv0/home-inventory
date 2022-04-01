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
import { classes } from "@utils/classes";
import { updateItemInShoppingList } from "@actions/shopping-list";
import { RequestData } from "@lib/fetch";

interface Props {
  products: (Product | ShoppingListItem)[];
  showPagination?: boolean;
  currency?: string;

  showManageButton?: boolean;
  showDeleteButton?: boolean;

  onManageClick?(product: Product): unknown;
  onDeleteClick?(product: ShoppingListItem): unknown;
  bulkDeleteProducts?(houseId: string, productIds: string[]): Promise<boolean>;
  updateItemInShoppingList?(houseId: string, id: string, data: RequestData): Promise<boolean>;
}

const ProductsListC = ({ products, showPagination, ...props }: Props) => {
  const [currentPage, setCurrentPage] = React.useState<number>(0);

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

  return (
    <>
      <div style={{ marginTop: "1rem" }}>
        <ul className={styles.items}>
          {list().map((item) => (
            <ListItem key={item.id} item={item} {...props} />
          ))}
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

type ItemProps = Pick<
  Props,
  | "currency"
  | "showManageButton"
  | "showDeleteButton"
  | "onDeleteClick"
  | "onManageClick"
  | "updateItemInShoppingList"
>;

const ListItem = ({
  item,
  currency,
  showDeleteButton,
  showManageButton,
  onDeleteClick,
  onManageClick,
  updateItemInShoppingList,
}: { item: ShoppingListItem | Product } & ItemProps) => {
  const [checked, setChecked] = React.useState("completed" in item ? item.completed : false);

  const categories = useSelector((state: State) => state.admin.categories);
  const houseId = useHouseId();

  const product = "product" in item ? item.product : item;
  const category = categories.find((c) => c.id === product.categoryId);

  const expirationDate = product.expirationDate
    ? format(new Date(product.expirationDate), "yyyy-MM-dd")
    : "N/A";
  const prices = product.prices.reduce((ac, cv) => ac + cv, 0);

  async function handleChange() {
    if (!showDeleteButton) return;

    const ch = !checked;
    setChecked(ch);
    await updateItemInShoppingList?.(houseId, item.id, { completed: ch });
  }

  return (
    <div className={classes(styles.item, checked && styles.checked)} key={product.id}>
      {showDeleteButton ? (
        <input
          onChange={handleChange}
          checked={checked}
          value={`${checked}`}
          type="checkbox"
          className={styles.checkbox}
        />
      ) : null}

      <h1 className={styles.name}>{product.name}</h1>

      <p className={styles.info}>
        <span>
          <span className={styles.bold}>Price: </span> {currency}
          {Intl.NumberFormat().format(product.price)}
        </span>

        <span>
          <span className={styles.bold}>Total Price: </span> {currency}
          {Intl.NumberFormat().format(prices)}
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
        <button onClick={() => onDeleteClick?.(item as ShoppingListItem)} className="btn danger">
          Delete from list
        </button>
      ) : null}
    </div>
  );
};

const mapToProps = (state: State) => ({
  currency: state.houses.house?.currency ?? "€",
});

export const ProductsList: React.FC<Props> = connect(mapToProps, { updateItemInShoppingList })(
  ProductsListC,
);

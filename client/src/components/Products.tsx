import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Product } from "@t/Product";
import { Select, SelectValue } from "@components/Select/Select";
import { sortProducts } from "@utils/sortProducts";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import formStyles from "css/forms.module.scss";
import { ProductsTable } from "@components/ProductsTable";
import styles from "css/products.module.scss";
import { setter } from "@lib/setter";
import { FilterKeys, filters } from "@lib/constants";

const AddProductModal = dynamic(() => import("@components/modals/products/AddProductModal"));
const ManageProductModal = dynamic(() => import("@components/modals/products/ManageProductModal"));

interface Props {
  products: Product[];
}

export const Products = ({ products }: Props) => {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [searchValue, setSearchValue] = React.useState<string>("");
  const [tempProduct, setTempProduct] = React.useState<Product | null>(null);
  const [filter, setFilter] = React.useState<SelectValue<FilterKeys> | null>({
    label: "Created at",
    value: "createdAt",
  });

  function handleManage(product: Product) {
    setTempProduct(product);

    openModal(ModalIds.ManageProduct);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchRef.current?.focus();
  }

  const filtered = React.useMemo(() => {
    if (!filter) return products;

    let items = products;

    if (searchValue) {
      items = items.filter((v) => v.name.toLowerCase().includes(searchValue.toLowerCase()));
    } else {
      items = products;
    }

    return sortProducts(filter.value, items);
  }, [products, searchValue, filter]);

  return (
    <>
      <div className={styles.productsHeader}>
        <h1>Products</h1>

        <div className={styles.productsButtons}>
          <button onClick={() => openModal(ModalIds.AddProduct)} className="btn">
            Add product
          </button>

          <div className={styles.productsSelect}>
            <Select
              isClearable
              theme={{ backgroundColor: "#eeeeee" }}
              onChange={setFilter}
              value={filter}
              options={Object.entries(filters).map(([key, value]) => ({
                label: value,
                value: key,
              }))}
            />
          </div>
        </div>
      </div>

      <form onSubmit={onSearchSubmit} style={{ display: "flex", marginTop: "2rem" }}>
        <input
          ref={searchRef}
          value={searchValue}
          onChange={setter(setSearchValue)}
          className={formStyles.formInput}
          style={{ background: "#eeeeee", width: "100%" }}
          placeholder="Find a product by its name"
        />

        <button style={{ marginLeft: "0.5rem" }} type="submit" className="btn">
          Search
        </button>
      </form>

      {products.length <= 0 ? (
        <p style={{ marginTop: "1rem" }}>
          {router.pathname.includes("category") ? (
            <>There are no products in this category.</>
          ) : (
            <>There {"aren't"} any products yet.</>
          )}
        </p>
      ) : filtered.length <= 0 ? (
        <p style={{ marginTop: "1rem" }}>No items were found with that search query.</p>
      ) : (
        <ProductsTable
          showActions
          onManageClick={handleManage}
          products={filtered}
          currentFilter={filter?.value ?? null}
        />
      )}

      <AddProductModal />
      <ManageProductModal product={tempProduct} />
    </>
  );
};

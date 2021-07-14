import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Product } from "@t/Product";
import { SelectValue } from "@components/Select/Select";
import { sortProducts } from "@utils/sortProducts";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import formStyles from "css/forms.module.scss";
import { ProductsTable } from "@components/ProductsTable";
import styles from "./products.module.scss";
import { setter } from "@lib/setter";
import { FilterKeys, filters } from "@lib/constants";
import { download } from "@utils/download";
import ImportProductsModal from "@components/modals/products/ImportProductsModal";
import Dropdown from "@components/Dropdown/Dropdown";
import { DotsIcon } from "icons/Dots";
import { ArrowIcon } from "icons/Arrow";
import { parseExport } from "@utils/parseExport";
import { useSelector } from "react-redux";
import { State } from "@t/State";

const AddProductModal = dynamic(() => import("@components/modals/products/AddProductModal"));
const ManageProductModal = dynamic(() => import("@components/modals/products/ManageProductModal"));

interface Props {
  products: Product[];
}

export const Products = ({ products }: Props) => {
  const categories = useSelector((state: State) => state.admin.categories);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isOpen, setOpen] = React.useState(false);
  const [isSelectOpen, setSelectOpen] = React.useState(false);

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
          <div>
            <Dropdown
              width="150px"
              onClose={() => setOpen(false)}
              isOpen={isOpen}
              autoFocus
              options={[
                {
                  name: "Export",
                  onClick: () => {
                    download(
                      `products_${Date.now()}.json`,
                      JSON.stringify(parseExport(products, categories), null, 2),
                    );
                  },
                },
                {
                  name: "Import",
                  onClick: () => openModal(ModalIds.ImportProducts),
                },
              ]}
            >
              <button aria-label="More" onClick={() => setOpen((v) => !v)} className="btn icon-btn">
                <DotsIcon height="25.6" width="25.6" />
              </button>
            </Dropdown>
          </div>

          <button onClick={() => openModal(ModalIds.AddProduct)} className="btn">
            Add product
          </button>

          <Dropdown
            width="200px"
            onClose={() => setSelectOpen(false)}
            isOpen={isSelectOpen}
            autoFocus
            closeOnClick
            options={Object.entries(filters).map(([key, value]) => ({
              name: value,
              value,
              onClick: () => setFilter({ label: value, value: key as FilterKeys }),
            }))}
          >
            <button
              style={{ width: "170px", height: "100%" }}
              onClick={() => setSelectOpen((v) => !v)}
              className="btn has-icon"
            >
              {filter?.label}{" "}
              <ArrowIcon style={{ transform: isSelectOpen ? "rotate(-180deg)" : "" }} />
            </button>
          </Dropdown>
        </div>
      </div>

      <form onSubmit={onSearchSubmit} style={{ display: "flex", marginTop: "2rem" }}>
        <input
          ref={searchRef}
          value={searchValue}
          onChange={setter(setSearchValue)}
          className={formStyles.formInput}
          style={{ background: "var(--gray)", width: "100%" }}
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

      <ImportProductsModal />
      <AddProductModal />
      <ManageProductModal product={tempProduct} />
    </>
  );
};

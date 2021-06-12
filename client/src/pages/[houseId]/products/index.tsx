import { connect } from "react-redux";
import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

import { Layout } from "@components/Layout";
import { Product } from "@t/Product";
import { State } from "@t/State";
import { Select, SelectValue } from "@components/Select/Select";
import { sortProducts } from "@utils/sortProducts";
import { initializeStore } from "src/store/store";
import { checkAuth } from "@actions/auth";
import { getAllProducts } from "@actions/products";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import { getAllCategories } from "@actions/admin/categories";
import formStyles from "css/forms.module.scss";
import { ProductsTable } from "@components/ProductsTable";
import { getCurrentHouse } from "@actions/houses";

const AddProductModal = dynamic(() => import("@components/modals/products/AddProductModal"));
const ManageProductModal = dynamic(() => import("@components/modals/products/ManageProductModal"));

interface Props {
  products: Product[];
  isAuth: boolean;
  loading: boolean;
}

export const filters = {
  name: "Name",

  createdAt: "Created at",
  updatedAt: "Updated at",

  price: "Price lowest",
  priceHigh: "Price highest",

  quantity: "Quantity lowest",
  quantityHigh: "Quantity highest",
};

const ProductsPage = ({ products, isAuth, loading }: Props) => {
  const router = useRouter();
  const searchRef = React.useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = React.useState<string>("");
  const [tempProduct, setTempProduct] = React.useState<Product | null>(null);
  const [filter, setFilter] = React.useState<SelectValue<keyof typeof filters> | null>({
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

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth/login");
    }
  }, [isAuth, loading, router]);

  return (
    <Layout showCurrentHouse>
      <Head>
        <title>Products - Inventory</title>
      </Head>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Products</h1>

        <div style={{ display: "flex" }}>
          <button
            onClick={() => openModal(ModalIds.AddProduct)}
            style={{ marginRight: "0.5rem" }}
            className="btn"
          >
            Add product
          </button>
          <div style={{ width: "200px" }}>
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
          onChange={(e) => setSearchValue(e.target.value)}
          className={formStyles.formInput}
          style={{ background: "#eeeeee", width: "100%" }}
          placeholder="Find a product by its name"
        />

        <button style={{ marginLeft: "0.5rem" }} type="submit" className="btn">
          Search
        </button>
      </form>

      <ProductsTable
        showActions
        onManageClick={handleManage}
        products={filtered}
        currentFilter={filter?.value ?? null}
      />

      <AddProductModal />
      <ManageProductModal product={tempProduct} />
    </Layout>
  );
};

const mapToProps = (state: State): Props => ({
  products: state.products.products,
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;

  await checkAuth(cookie)(store.dispatch);
  await getCurrentHouse(houseId, cookie)(store.dispatch);
  await getAllProducts(houseId, cookie)(store.dispatch);
  await getAllCategories(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default connect(mapToProps)(ProductsPage);

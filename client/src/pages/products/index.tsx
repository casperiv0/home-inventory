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
      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  return (
    <Layout>
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

      <table style={{ marginTop: "1rem" }} className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Total amount</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((product) => {
            /**
             * set the current filter to bold
             */
            const boldText = (str: string) => {
              return filter?.value === str;
            };

            const totalPricesAmount = (product.prices ?? [])
              ?.reduce((ac, curr) => ac + curr, 0)
              .toFixed(2);

            return (
              <tr key={product.id}>
                <td className={boldText("name") ? "bold" : ""}>{product.name}</td>
                <td className={boldText("price") || boldText("priceHigh") ? "bold" : ""}>
                  €{product.price.toFixed(2)}
                </td>
                <td>€{totalPricesAmount}</td>
                <td className={boldText("quantity") || boldText("quantityHigh") ? "bold" : ""}>
                  {product.quantity}
                </td>
                <td className={boldText("expirationDate") ? "bold" : ""}>
                  {product.expirationDate}
                </td>
                <td id="table-actions">
                  <button onClick={() => handleManage(product)} className="btn small">
                    Manage
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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

  await checkAuth(cookie)(store.dispatch);
  await getAllProducts(cookie)(store.dispatch);
  await getAllCategories(cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default connect(mapToProps)(ProductsPage);

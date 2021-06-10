import { connect } from "react-redux";
import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Layout } from "@components/Layout";
import { Product } from "@t/Product";
import { State } from "@t/State";
import { Select, SelectValue } from "@components/Select/Select";
import { sortProducts } from "@utils/sortProducts";
import { GetServerSideProps } from "next";
import { initializeStore } from "src/store/store";
import { checkAuth } from "@actions/auth";
import { getAllProducts } from "@actions/products";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import AddProductModal from "@components/modals/products/AddProductModal";
import { getAllCategories } from "@actions/admin/categories";

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
  const [filter, setFilter] = React.useState<SelectValue | null>({
    label: "Created at",
    value: "createdAt",
  });
  const router = useRouter();

  const filtered = React.useMemo(() => {
    if (!filter?.value) return products;

    return sortProducts(filter.value as any, products);
  }, [products, filter]);

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
            {/* todo: ability to have custom colors for select background */}
            <Select
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

      <table style={{ marginTop: "1rem" }} className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.expirationDate}</td>
              <td id="table-actions">
                <button onClick={() => null} className="btn small">
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddProductModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
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

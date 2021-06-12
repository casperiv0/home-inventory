import { connect } from "react-redux";
import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { Layout } from "@components/Layout";
import { Product } from "@t/Product";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { checkAuth } from "@actions/auth";
import { getAllProducts } from "@actions/products";
import { getAllCategories } from "@actions/admin/categories";
import { getCurrentHouse } from "@actions/houses";
import { Products } from "@components/Products";

interface Props {
  products: Product[];
  isAuth: boolean;
  loading: boolean;
}

const ProductsPage = ({ products, isAuth, loading }: Props) => {
  const router = useRouter();

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

      <Products products={products} />
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

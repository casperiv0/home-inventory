import type { GetServerSideProps } from "next";
import { connect } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";

import { getAllCategories } from "@actions/admin/categories";
import { checkAuth } from "@actions/auth";
import { getCurrentHouse } from "@actions/houses";
import { getProductsByCategory } from "@actions/products";
import { Layout } from "@components/Layout";
import { Products } from "@components/Products/Products";
import type { Product } from "@t/Product";
import type { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { useIsAuth } from "@hooks/useIsAuth";
import { useValidHouse } from "@hooks/useValidHouse";

interface Props {
  products: Product[];
}

const FilterByCategoryPage = ({ products }: Props) => {
  const router = useRouter();
  useIsAuth();
  useValidHouse();

  return (
    <Layout>
      <Head>
        <title>Category: {router.query.name} - Inventory</title>
      </Head>
      <Products products={products} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;
  const categoryName = ctx.query.name as string;

  await checkAuth(cookie)(store.dispatch);
  await getCurrentHouse(houseId, cookie)(store.dispatch);
  await getProductsByCategory(houseId, categoryName, cookie)(store.dispatch);
  await getAllCategories(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State): Props => ({
  products: state.products.products,
});

export default connect(mapToProps)(FilterByCategoryPage);

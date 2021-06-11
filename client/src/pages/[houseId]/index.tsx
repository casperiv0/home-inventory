import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { checkAuth } from "@actions/auth";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { Layout } from "@components/Layout";
import { getStats } from "@actions/products";
import StatsCards from "@components/home/StatsCards";
import { getCurrentHouse } from "@actions/houses";

interface Props {
  isAuth: boolean;
  loading: boolean;
}

const HousePage = ({ isAuth, loading }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  return (
    <Layout showCurrentHouse>
      <Head>
        <title>Home - Inventory</title>
      </Head>

      <StatsCards />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;

  await checkAuth(cookie)(store.dispatch);
  await getCurrentHouse(houseId, cookie)(store.dispatch);
  await getStats(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State): Props => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
});

export default connect(mapToProps)(HousePage);

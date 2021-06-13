import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { checkAuth } from "@actions/auth";
import { initializeStore } from "src/store/store";
import { Layout } from "@components/Layout";
import { getStats } from "@actions/products";
import StatsCards from "@components/home/StatsCards";
import { getCurrentHouse } from "@actions/houses";
import { useIsAuth } from "@hooks/useIsAuth";
import { useValidHouse } from "@hooks/useValidHouse";

const HousePage = () => {
  useIsAuth();
  useValidHouse();

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

export default connect(null)(HousePage);

import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { checkAuth } from "@actions/auth";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { Layout } from "@components/Layout";
import { User } from "@t/User";
import { getStats } from "@actions/products";
import StatsCards from "@components/home/StatsCards";

interface Props {
  isAuth: boolean;
  loading: boolean;
  user: User | null;
}

const HousePage = ({ isAuth, loading, user }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  return (
    <Layout>
      <Head>
        <title>Home - Inventory</title>
      </Head>

      <div style={{ marginTop: "1rem" }}>
        <p>
          <em>
            Logged in as <strong>{user?.email}</strong>
          </em>
        </p>
      </div>

      <StatsCards />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;

  await checkAuth(cookie)(store.dispatch);
  await getStats(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State): Props => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapToProps)(HousePage);

import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { checkAuth } from "@actions/auth";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { Layout } from "@components/Layout";
import { getAllUsers } from "@actions/admin/users";
import { User } from "@t/User";
import { usersColumns } from "@lib/reactTable";
import { Table } from "@components/Table/Table";

interface Props {
  isAuth: boolean;
  users: User[];
}

const UsersAdminPage = ({ isAuth, users }: Props) => {
  const router = useRouter();
  const columns = React.useMemo(() => usersColumns, []);

  console.log(users);

  React.useEffect(() => {
    if (!isAuth) {
      router.push("/auth");
    }
  }, [isAuth, router]);

  return (
    <Layout>
      <div style={{ marginTop: "1rem" }}>
        {/* todo: add actions to columns */}
        <Table columns={columns} data={users} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;

  await checkAuth(cookie)(store.dispatch);
  await getAllUsers(cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  users: state.admin.users,
});

export default connect(mapToProps)(UsersAdminPage);

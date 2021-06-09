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
import { AddUserModal } from "@components/modals/AddUserModal";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";

interface Props {
  isAuth: boolean;
  loading: boolean;
  users: User[];
}

const UsersAdminPage = ({ isAuth, loading, users }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  return (
    <Layout>
      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1>Users</h1>

          <button onClick={() => openModal(ModalIds.AddUser)} className="btn">
            Add user
          </button>
        </div>

        <table style={{ marginTop: "0.5rem" }} className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => alert("Hello world")} className="btn small">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal />
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
  loading: state.auth.loading,
});

export default connect(mapToProps)(UsersAdminPage);

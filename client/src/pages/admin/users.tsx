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
import AddUserModal from "@components/modals/admin/AddUserModal";
import ManageUserModal from "@components/modals/admin/ManageUserModal";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";

interface Props {
  isAuth: boolean;
  loading: boolean;
  users: User[];
  user: User | null;
}

const UsersAdminPage = ({ isAuth, loading, users, user }: Props) => {
  const router = useRouter();
  const [tempUser, setTempUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (!loading && !isAuth) {
      console.log("here");

      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  React.useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/404");
    }
  }, [loading, user?.role, router]);

  function handleManage(user: User) {
    setTempUser(user);

    openModal(ModalIds.ManageUser);
  }

  function sortByCreatedAt(a: User, b: User) {
    return new Date(b.createdAt) > new Date(a.createdAt) ? -1 : 1;
  }

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
            {users
              .sort((a, b) => sortByCreatedAt(a, b))
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td id="table-actions">
                    <button onClick={() => handleManage(user)} className="btn small">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ManageUserModal user={tempUser} />
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
  user: state.auth.user,
});

export default connect(mapToProps)(UsersAdminPage);

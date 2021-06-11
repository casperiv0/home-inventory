import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";

import { checkAuth } from "@actions/auth";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { AdminLayout } from "@components/AdminLayout";
import { getAllUsers } from "@actions/admin/users";
import { User, UserRole } from "@t/User";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import { useHasAccess } from "@hooks/useHasAccess";
import { getCurrentHouse } from "@actions/houses";

const AddUserModal = dynamic(() => import("@components/modals/admin/AddUserModal"));
const ManageUserModal = dynamic(() => import("@components/modals/admin/ManageUserModal"));

interface Props {
  isAuth: boolean;
  loading: boolean;
  users: User[];
  user: User | null;
}

const UsersAdminPage = ({ isAuth, users }: Props) => {
  const router = useRouter();
  const { loading, hasAccess } = useHasAccess(UserRole.ADMIN);
  const [tempUser, setTempUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  React.useEffect(() => {
    if (!loading && !hasAccess) {
      router.push("/404");
    }
  }, [loading, hasAccess, router]);

  function handleManage(user: User) {
    setTempUser(user);

    openModal(ModalIds.ManageUser);
  }

  function sortByCreatedAt(a: User, b: User) {
    return new Date(b.createdAt) > new Date(a.createdAt) ? -1 : 1;
  }

  return (
    <AdminLayout>
      <Head>
        <title>Manage users - Inventory</title>
      </Head>

      <div style={{ marginTop: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Users</h1>

          <button onClick={() => openModal(ModalIds.AddUser)} className="btn">
            Add user
          </button>
        </div>

        <table style={{ marginTop: "0.5rem" }} className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users
              .sort((a, b) => sortByCreatedAt(a, b))
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
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
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;

  await checkAuth(cookie)(store.dispatch);
  await getCurrentHouse(houseId, cookie)(store.dispatch);
  await getAllUsers(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State): Props => ({
  isAuth: state.auth.isAuth,
  users: state.admin.users,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapToProps)(UsersAdminPage);

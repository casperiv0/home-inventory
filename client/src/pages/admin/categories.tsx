import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { checkAuth } from "@actions/auth";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { AdminLayout } from "@components/AdminLayout";
import { getAllCategories } from "@actions/admin/categories";
import { User } from "@t/User";
import AddCategoryModal from "@components/modals/admin/AddCategoryModal";
import ManageCategoryModal from "@components/modals/admin/ManageCategoryModal";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import { Category } from "@t/Category";

interface Props {
  isAuth: boolean;
  loading: boolean;
  categories: Category[];
  user: User | null;
}

const CategoriesAdminPage = ({ isAuth, loading, categories, user }: Props) => {
  const router = useRouter();
  const [tempCategory, setTempCategory] = React.useState<Category | null>(null);

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth");
    }
  }, [isAuth, loading, router]);

  React.useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/404");
    }
  }, [loading, user?.role, router]);

  function handleManage(category: Category) {
    setTempCategory(category);

    openModal(ModalIds.ManageCategory);
  }

  function sortByCreatedAt(a: Category, b: Category) {
    return new Date(b.createdAt) > new Date(a.createdAt) ? -1 : 1;
  }

  return (
    <AdminLayout>
      <Head>
        <title>Manage categories - Inventory</title>
      </Head>

      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1>Categories</h1>

          <button onClick={() => openModal(ModalIds.AddCategory)} className="btn">
            Add category
          </button>
        </div>

        <table style={{ marginTop: "0.5rem" }} className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories
              .sort((a, b) => sortByCreatedAt(a, b))
              .map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td id="table-actions">
                    <button onClick={() => handleManage(category)} className="btn small">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ManageCategoryModal category={tempCategory} />
      <AddCategoryModal />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;

  await checkAuth(cookie)(store.dispatch);
  await getAllCategories(cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  categories: state.admin.categories,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapToProps)(CategoriesAdminPage);

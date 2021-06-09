import styles from "css/layout.module.scss";
import { AdminSidebar } from "@components/admin/Sidebar/Sidebar";
import { Layout } from "./Layout";

export const AdminLayout: React.FC = ({ children }) => {
  return (
    <Layout>
      <div className={styles.adminContent}>
        <AdminSidebar />
        <>{children}</>
      </div>
    </Layout>
  );
};

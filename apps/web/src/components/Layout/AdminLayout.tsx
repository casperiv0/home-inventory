import type * as React from "react";
import styles from "./layout.module.scss";
import { AdminSidebar } from "@components/admin/Sidebar/Sidebar";
import { Layout } from "./Layout";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout showCurrentHouse>
      <div className={styles.adminContent}>
        <AdminSidebar />
        {children}
      </div>
    </Layout>
  );
}

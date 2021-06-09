import * as React from "react";
import Link from "next/link";
import styles from "./sidebar.module.scss";
import { useRouter } from "next/router";

export const AdminSidebar = () => {
  const router = useRouter();
  const activeRouter = (route: string) => (router.asPath === route ? styles.sidebarItemActive : "");

  return (
    <nav className={styles.adminSidebar}>
      <ul className={styles.adminItems}>
        <Link href="/admin/users">
          <a className={[styles.sidebarItem, activeRouter("/admin/users")].join(" ")}>Users</a>
        </Link>

        <Link href="/admin/categories">
          <a className={[styles.sidebarItem, activeRouter("/admin/categories")].join(" ")}>
            Categories
          </a>
        </Link>
      </ul>
    </nav>
  );
};

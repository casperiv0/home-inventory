import * as React from "react";
import Link from "next/link";
import styles from "./sidebar.module.scss";
import { useRouter } from "next/router";
import { useHouseId } from "@hooks/useHouseId";

export const AdminSidebar = () => {
  const router = useRouter();
  const houseId = useHouseId();
  const activeRouter = (route: string) => (router.asPath === route ? styles.sidebarItemActive : "");

  return (
    <nav className={styles.adminSidebar}>
      <ul className={styles.adminItems}>
        <Link href={`/${houseId}/admin/users`}>
          <a className={[styles.sidebarItem, activeRouter(`/${houseId}/admin/users`)].join(" ")}>
            Users
          </a>
        </Link>

        <Link href={`/${houseId}/admin/categories`}>
          <a
            className={[styles.sidebarItem, activeRouter(`/${houseId}/admin/categories`)].join(" ")}
          >
            Categories
          </a>
        </Link>
      </ul>
    </nav>
  );
};

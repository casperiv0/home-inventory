import * as React from "react";
import Link from "next/link";
import styles from "./sidebar.module.scss";
import { useRouter } from "next/router";
import { useHouseId } from "@hooks/useHouseId";
import { classes } from "@utils/classes";

export function AdminSidebar() {
  const router = useRouter();
  const houseId = useHouseId();
  const activeRouter = (route: string) => (router.asPath === route ? styles.sidebarItemActive : "");

  function push(page: string) {
    return router.push(`/${houseId}/admin/${page}`);
  }

  return (
    <nav className={styles.adminSidebar}>
      <ul className={styles.adminItems}>
        <li
          onClick={() => push("")}
          className={classes(styles.sidebarItem, activeRouter(`/${houseId}/admin`))}
        >
          <Link href={`/${houseId}/admin`}>
            <a>General</a>
          </Link>
        </li>
        <li
          onClick={() => push("users")}
          className={classes(styles.sidebarItem, activeRouter(`/${houseId}/admin/users`))}
        >
          <Link href={`/${houseId}/admin/users`}>
            <a>Users</a>
          </Link>
        </li>

        <li
          onClick={() => push("categories")}
          className={classes(styles.sidebarItem, activeRouter(`/${houseId}/admin/categories`))}
        >
          <Link href={`/${houseId}/admin/categories`}>
            <a>Categories</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

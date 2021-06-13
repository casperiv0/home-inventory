import Link from "next/link";
import styles from "css/nav.module.scss";
import { useHouseId } from "@hooks/useHouseId";
import { useHasAccess } from "@hooks/useHasAccess";
import { UserRole } from "@t/User";

export const Nav = () => {
  const houseId = useHouseId();
  const { hasAccess } = useHasAccess(UserRole.ADMIN);

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <div className={styles.navTitle}>
          <Link href="/">
            <a>Inventory</a>
          </Link>
        </div>

        <ul className={styles.navLinks}>
          {houseId ? (
            <>
              <li className={styles.navLink}>
                <Link href={`/${houseId}`}>
                  <a>Home</a>
                </Link>
              </li>

              <li className={styles.navLink}>
                <Link href={`/${houseId}/products`}>
                  <a>Products</a>
                </Link>
              </li>

              {hasAccess ? (
                <li className={styles.navLink}>
                  <Link href={`/${houseId}/admin/users`}>
                    <a>Admin</a>
                  </Link>
                </li>
              ) : null}
            </>
          ) : (
            <li className={styles.navLink}>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

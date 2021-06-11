import Link from "next/link";
import styles from "css/nav.module.scss";
import { useHouseId } from "@hooks/useHouseId";

export const Nav = () => {
  const houseId = useHouseId();

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <div className={styles.navTitle}>Inventory</div>

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

              {/* todo: add other links */}
              <li className={styles.navLink}>
                <Link href={`/${houseId}/admin/users`}>
                  <a>Admin</a>
                </Link>
              </li>
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

import Link from "next/link";
import styles from "css/nav.module.scss";

export const Nav = () => {
  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <div className={styles.navTitle}>Inventory</div>

        <ul className={styles.navLinks}>
          <li className={styles.navLink}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>

          {/* todo: add other links */}
          <li className={styles.navLink}>
            <Link href="/admin/users">
              <a>Admin</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

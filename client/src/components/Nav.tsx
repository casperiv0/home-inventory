import Link from "next/link";
import * as React from "react";
import styles from "css/nav.module.scss";
import { useHouseId } from "@hooks/useHouseId";
import { useHasAccess } from "@hooks/useHasAccess";
import { UserRole } from "@t/User";
import { getTheme, setThemeClass, Theme } from "@lib/theme";
import { SunIcon } from "./icons/Sun";
import { MoonIcon } from "./icons/Moon";
import { classes } from "@utils/classes";

export const Nav = () => {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const t = getTheme();

    setTheme(t);
  }, []);

  function handleClick() {
    const newT = theme === "light" ? "dark" : "light";

    setTheme(newT);
    setThemeClass(newT);
  }

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

        <div className={styles.navLinksContainer}>
          <ul className={styles.navLinks}>
            {houseId ? (
              <>
                <li className={styles.navLink}>
                  <Link href={`/${houseId}`}>
                    <a>Home</a>
                  </Link>
                </li>

                <li className={styles.navLink}>
                  <Link scroll href={`/${houseId}/products`}>
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
              <>
                <li className={styles.navLink}>
                  <Link href="/">
                    <a>Home</a>
                  </Link>
                </li>
                <li className={styles.navLink}>
                  <Link href="/user/settings">
                    <a>Settings</a>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <button onClick={handleClick} className={classes("btn", "icon-btn", styles.navLink)}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

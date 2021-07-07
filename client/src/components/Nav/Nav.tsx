import Link from "next/link";
import * as React from "react";
import styles from "./nav.module.scss";
import { useHouseId } from "@hooks/useHouseId";
import { useHasAccess } from "@hooks/useHasAccess";
import { UserRole } from "@t/User";
import { getNewTheme, getTheme, setTheme as setLocalTheme, Theme } from "@lib/theme";
import { SunIcon } from "icons/Sun";
import { MoonIcon } from "icons/Moon";
import { ListIcon } from "icons/List";
import { classes } from "@utils/classes";

export const Nav = () => {
  const [theme, setTheme] = React.useState<Theme>("light");
  const ulRef = React.useRef<HTMLUListElement>(null);

  const houseId = useHouseId();
  const { hasAccess } = useHasAccess(UserRole.ADMIN);

  React.useEffect(() => {
    setTheme(getTheme());
  }, []);

  React.useEffect(() => {
    const handler = () => {
      ulRef.current?.classList.remove(styles.menuActive);
    };

    const listItems = document.querySelectorAll("#navUlList li");

    listItems.forEach((li) => {
      li.addEventListener("click", handler);
    });

    return () => {
      listItems.forEach((li) => {
        li.removeEventListener("click", handler);
      });
    };
  }, []);

  function handleThemeClick() {
    const newT = getNewTheme(theme);

    setTheme(newT);
    setLocalTheme(newT);
  }

  function handleNavClick() {
    const classList = ulRef.current?.classList;

    if (classList?.contains(styles.menuActive)) {
      classList.remove(styles.menuActive);
    } else {
      classList?.add(styles.menuActive);
    }
  }

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navContent}>
        <div className={styles.navTitle}>
          <Link href="/">
            <a>Inventory</a>
          </Link>
        </div>

        <div className={styles.navLinksContainer}>
          <ul id="navUlList" ref={ulRef} className={styles.navLinks}>
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

          <button
            aria-label="Open navigation menu"
            onClick={handleNavClick}
            className={classes("btn", "icon-btn", styles.menuBtn, styles.navLink)}
          >
            <ListIcon />
          </button>

          <button
            aria-label={`Switch to ${getNewTheme(theme)} theme`}
            onClick={handleThemeClick}
            className={classes("btn", "icon-btn", styles.navLink)}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

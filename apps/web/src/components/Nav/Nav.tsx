import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/router";
import { useHouseId } from "@hooks/useHouseId";
import { useHasAccess } from "@hooks/useHasAccess";
import { UserRole } from "@t/User";
import { getNewTheme, getTheme, setTheme as setLocalTheme, Theme } from "@lib/theme";
import { SunIcon } from "icons/Sun";
import { MoonIcon } from "icons/Moon";
import { ListIcon } from "icons/List";
import { classes } from "@utils/classes";
import styles from "./nav.module.scss";
import { useSSRSafeId } from "@react-aria/ssr";

export function Nav() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const ulRef = React.useRef<HTMLUListElement>(null);
  const router = useRouter();
  const isActive = (str: "/[houseId]" | "/products" | "/admin" | "/shopping-list") => {
    const active = str === "/[houseId]" ? router.pathname === str : router.pathname.includes(str);
    return active && styles.navLinkActive;
  };

  const themeId = useSSRSafeId();
  const navMenuId = useSSRSafeId();

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
          <ul
            style={{ minWidth: houseId && "360px" }}
            id="navUlList"
            ref={ulRef}
            className={styles.navLinks}
          >
            {houseId ? (
              <>
                <li className={classes(styles.navLink, isActive("/[houseId]"))}>
                  <Link href={`/${houseId}`}>
                    <a>Home</a>
                  </Link>
                </li>

                <li className={classes(styles.navLink, isActive("/products"))}>
                  <Link scroll href={`/${houseId}/products`}>
                    <a>Products</a>
                  </Link>
                </li>

                <li className={classes(styles.navLink, isActive("/shopping-list"))}>
                  <Link scroll href={`/${houseId}/shopping-list`}>
                    <a>Shopping List</a>
                  </Link>
                </li>

                {hasAccess ? (
                  <li className={classes(styles.navLink, isActive("/admin"))}>
                    <Link href={`/${houseId}/admin`}>
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
            id={navMenuId}
            aria-label="Open navigation menu"
            onClick={handleNavClick}
            className={classes("btn", "icon-btn", styles.menuBtn)}
          >
            <ListIcon aria-labelledby={navMenuId} />
          </button>

          <button
            id={themeId}
            aria-label={`Switch to ${getNewTheme(theme)} theme`}
            onClick={handleThemeClick}
            className={classes("btn", "icon-btn", styles.navLink)}
          >
            {theme === "dark" ? (
              <SunIcon aria-labelledby={themeId} />
            ) : (
              <MoonIcon aria-labelledby={themeId} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

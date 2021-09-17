import { useSelector } from "react-redux";
import * as React from "react";
import { Nav } from "@components/Nav";
import styles from "./layout.module.scss";
import { State } from "@t/State";
import Dropdown from "@components/Dropdown/Dropdown";
import { House } from "@t/House";
import { useRouter } from "next/router";

interface Props {
  nav?: boolean;
  showCurrentHouse?: boolean;
}

export const Layout: React.FC<Props> = ({ nav = true, showCurrentHouse, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  const currentHouse = useSelector((state: State) => state.houses.house);
  const houses = useSelector((state: State) => state.houses.houses);
  const auth = useSelector((state: State) => state.auth);
  const router = useRouter();

  function redirect(house: House) {
    const path = router.pathname.replace("[houseId]", house.id);

    setOpen(false);
    router.push(path);
  }

  if (!auth.isAuth) {
    return <p>Not authenticated, redirecting...</p>;
  }

  return (
    <>
      {nav ? <Nav /> : null}

      <div className={styles.container}>
        <div className={styles.content}>
          {showCurrentHouse && currentHouse ? (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>Current house:</strong>
                <Dropdown
                  style={{ marginLeft: "0.5rem" }}
                  width="150px"
                  onClose={() => setOpen(false)}
                  isOpen={isOpen}
                  options={houses.map((house) => ({
                    name: house.name,
                    onClick: () => redirect(house),
                  }))}
                >
                  <button
                    className="btn small"
                    aria-label="More"
                    onClick={() => setOpen((v) => !v)}
                  >
                    {currentHouse.name}
                  </button>
                </Dropdown>
              </div>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </>
  );
};

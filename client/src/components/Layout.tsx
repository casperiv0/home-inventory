import { useSelector } from "react-redux";
import * as React from "react";
import { Nav } from "./Nav";
import styles from "css/layout.module.scss";
import { State } from "@t/State";

interface Props {
  nav?: boolean;
  showCurrentHouse?: boolean;
}

export const Layout: React.FC<Props> = ({ nav = true, showCurrentHouse, children }) => {
  const currentHouse = useSelector((state: State) => state.houses.house);

  return (
    <>
      {nav ? <Nav /> : null}

      <div className={styles.container}>
        <div className={styles.content}>
          {showCurrentHouse && currentHouse ? (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Current house:</strong> {currentHouse.name}
              </p>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </>
  );
};

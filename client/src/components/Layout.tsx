import { Nav } from "./Nav";
import styles from "css/layout.module.scss";

interface Props {
  nav?: boolean;
}

export const Layout: React.FC<Props> = ({ nav = true, children }) => {
  return (
    <>
      {nav ? <Nav /> : null}

      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};

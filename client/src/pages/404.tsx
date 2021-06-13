import { Layout } from "@components/Layout";
import styles from "css/404.module.scss";

const NotFound = () => {
  return (
    <Layout>
      <div className={styles.notFoundText}>
        <p>The requested page was not found</p>
      </div>
    </Layout>
  );
};

export default NotFound;

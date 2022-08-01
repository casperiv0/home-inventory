import styles from "./loader.module.scss";

export function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} aria-label="loading..." />
    </div>
  );
}

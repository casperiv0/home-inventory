import { connect } from "react-redux";

import styles from "css/home.module.scss";
import { State } from "@t/State";
import { Statistics } from "@t/Statistics";

interface Props {
  stats: Statistics | null;
}

const StatsCards = ({ stats }: Props) => {
  const { lowOnQuantity, totalSpent, soonToExpire } = stats ?? {};

  const soonToExpireText =
    soonToExpire?.length === 1 ? (
      <>
        There is <strong>1</strong> item that is going to expire soon.
      </>
    ) : (
      <>
        There are <strong>{soonToExpire?.length}</strong> items that are going to expire soon.
      </>
    );

  const lowOnQuantityText =
    lowOnQuantity?.length === 1 ? (
      <>
        There is <strong>1</strong> item that is low on quantity.
      </>
    ) : (
      <>
        There are <strong>{soonToExpire?.length}</strong> items that are low on quantity.
      </>
    );

  return (
    <div
      style={{
        marginTop: "1rem",
      }}
    >
      <h1>Stats</h1>

      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <h1>Total spent this month</h1>

          <p>
            There was a total of <strong>€{totalSpent}</strong> spent this month.
          </p>
        </div>

        <div className={styles.statsCard}>
          <h1>Soon to expire</h1>

          <p>{soonToExpireText}</p>
        </div>

        <div className={styles.statsCard}>
          <h1>Low on quantity</h1>

          <p>{lowOnQuantityText}</p>
        </div>
      </div>

      <div id="soon-to-expire" style={{ marginTop: "1rem" }}>
        <h1>Soon to expire</h1>
        TODO
      </div>

      <div id="low-on-quantity" style={{ marginTop: "1rem" }}>
        <h1>Low on quantity</h1>
        TODO
      </div>
    </div>
  );
};

const mapToProps = (state: State): Props => ({
  stats: state.products.stats,
});

export default connect(mapToProps)(StatsCards);

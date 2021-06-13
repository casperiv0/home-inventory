import { connect } from "react-redux";

import styles from "css/home.module.scss";
import { State } from "@t/State";
import { Statistics } from "@t/Statistics";
import { ProductsTable } from "../ProductsTable";

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
        There are <strong>{lowOnQuantity?.length}</strong> items that are low on quantity.
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

      <div className={styles.item} id="soon-to-expire">
        <h1>Soon to expire</h1>

        {(soonToExpire?.length ?? 0) <= 0 ? (
          <p>There are no products that are expiring soon yet.</p>
        ) : (
          <>
            <p>
              These items are going to expire soon. Make sure to double check these items before
              eating them!
            </p>

            <ProductsTable currentFilter="expirationDate" products={soonToExpire ?? []} />
          </>
        )}
      </div>

      <div className={styles.item} id="low-on-quantity">
        <h1>Low on quantity</h1>

        {(lowOnQuantity?.length ?? 0) <= 0 ? (
          <p>There are no items that are low on quantity yet.</p>
        ) : (
          <>
            <p>
              These products are low on quantity, do not forget to re-stock them next time going to
              the shop.
            </p>

            <ProductsTable currentFilter="quantity" products={lowOnQuantity ?? []} />
          </>
        )}
      </div>
    </div>
  );
};

const mapToProps = (state: State): Props => ({
  stats: state.products.stats,
});

export default connect(mapToProps)(StatsCards);

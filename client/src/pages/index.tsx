import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";

import { checkAuth } from "@actions/auth";
import { State } from "@t/State";
import { initializeStore } from "src/store/store";
import { Layout } from "@components/Layout";
import { User, UserRole } from "@t/User";
import { getHouses } from "@actions/houses";
import { House } from "@t/House";
import styles from "css/houses.module.scss";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import { EditIcon } from "@components/icons/Edit";
import ReactToolTip from "react-tooltip";
import { useIsAuth } from "@hooks/useIsAuth";

const AddHouseModal = dynamic(() => import("@components/modals/houses/AddHouseModal"));
const ManageHouseModal = dynamic(() => import("@components/modals/houses/ManageHouseModal"));

interface Props {
  user: User | null;
  houses: House[];
}

const IndexPage = ({ user, houses }: Props) => {
  const [tempHouse, setTempHouse] = React.useState<House | null>(null);
  useIsAuth();

  function handleManageHouse(house: House) {
    setTempHouse(house);
    openModal(ModalIds.ManageHouse);
  }

  return (
    <Layout>
      <Head>
        <title>Home - Inventory</title>
      </Head>

      <div style={{ marginTop: "1rem" }}>
        <p>
          <em>
            Logged in as <strong>{user?.email}</strong>
          </em>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <h1>Houses</h1>

        <button onClick={() => openModal(ModalIds.AddHouse)} className="btn">
          Add house
        </button>
      </div>

      <p style={{ marginTop: "0.5rem" }}>Below you can find all the houses you are a part of.</p>

      <div className={styles.housesGrid}>
        {houses.map((house) => {
          const role = house.houseRoles?.find((r) => r.userId === user?.id);

          return (
            <div key={house.id} className={styles.housesItem}>
              <header className={styles.houseItemHeader}>
                <Link href={`/${house.id}`}>
                  <a>
                    <h1>{house.name}</h1>
                  </a>
                </Link>

                {role?.role === UserRole.OWNER ? (
                  <div aria-label="Manage house">
                    <EditIcon
                      onClick={() => handleManageHouse(house)}
                      data-tip
                      data-for="EditHouse"
                    />

                    <ReactToolTip
                      textColor="var(--dark)"
                      backgroundColor="var(--tooltip-bg)"
                      effect="solid"
                      id="EditHouse"
                    >
                      Manage house
                    </ReactToolTip>
                  </div>
                ) : null}
              </header>

              <p>
                <strong>Users:</strong> {house.users?.length}
              </p>
              <p>
                <strong>Products:</strong> {house.products?.length}
              </p>
            </div>
          );
        })}
      </div>

      <ManageHouseModal house={tempHouse} />
      <AddHouseModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;

  await checkAuth(cookie)(store.dispatch);
  await getHouses(cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State): Props => ({
  user: state.auth.user,
  houses: state.houses.houses,
});

export default connect(mapToProps)(IndexPage);

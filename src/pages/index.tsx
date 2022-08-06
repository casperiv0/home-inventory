import { UserRole } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "utils/trpc";
import { EditIcon } from "____/web/src/components/icons/Edit";

export default function HomePage() {
  const userQuery = trpc.useQuery(["user.getSession"]);
  const housesQuery = trpc.useQuery(["houses.getUserHouses"]);
  const user = userQuery.data?.user;

  return (
    <>
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

      <div className="">
        {housesQuery.data?.map((house) => {
          const role = house.houseRoles.find((r) => r.userId === user?.id);

          return (
            <div
              key={house.id}
              //  className={styles.housesItem}
            >
              <header
              //  className={styles.houseItemHeader}
              >
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

      {/* <ManageHouseModal house={tempHouse} />
      <AddHouseModal /> */}
    </>
  );
}

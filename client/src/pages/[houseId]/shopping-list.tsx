import * as React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { checkAuth } from "@actions/auth";
import { initializeStore } from "src/store/store";
import { Layout } from "@components/Layout";
import { getCurrentHouse } from "@actions/houses";
import { useIsAuth } from "@hooks/useIsAuth";
import { useValidHouse } from "@hooks/useValidHouse";
import { getShoppingList } from "@actions/shopping-list";
import { ShoppingList, ShoppingListItem } from "@t/ShoppingList";
import { State } from "@t/State";
import { ProductsList } from "@components/views/ProductsList";
import { openModal } from "@lib/modal";
import { ModalIds } from "@t/ModalIds";
import { AddProductToShoppingListModal } from "@components/modals/shopping-list/AddProductToShoppingList";
import { getAllProducts } from "@actions/products";

interface Props {
  shoppingList: ShoppingList | null;
}

const HousePage = ({ shoppingList }: Props) => {
  useIsAuth();
  useValidHouse();

  async function handleDelete(item: ShoppingListItem) {
    console.log(item);
  }

  return (
    <Layout showCurrentHouse>
      <Head>
        <title>Shopping List - Inventory</title>
      </Head>

      <div style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Shopping List</h1>

          <button onClick={() => openModal(ModalIds.AddProductToShoppingList)} className="btn">
            Add product
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {!shoppingList || shoppingList.products.length <= 0 ? (
            <p>There are no products in the shopping list yet.</p>
          ) : (
            <ProductsList
              showDeleteButton
              onDeleteClick={handleDelete}
              showManageButton={false}
              products={shoppingList.products}
            />
          )}
        </div>
      </div>

      <AddProductToShoppingListModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;

  await checkAuth(cookie)(store.dispatch);
  await getCurrentHouse(houseId, cookie)(store.dispatch);
  await getShoppingList(houseId, cookie)(store.dispatch);
  await getAllProducts(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  shoppingList: state.shoppingList.shoppingList,
});

export default connect(mapToProps)(HousePage);

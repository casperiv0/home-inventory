import * as React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { checkAuth } from "@actions/auth";
import { getCurrentHouse, updateHouseById } from "@actions/houses";
import { useIsAuth } from "@hooks/useIsAuth";
import { useValidHouse } from "@hooks/useValidHouse";
import { State } from "@t/State";
import { UserRole } from "@t/User";
import { initializeStore } from "src/store/store";
import { useHasAccess } from "@hooks/useHasAccess";
import { AdminLayout } from "@components/Layout";
import { House } from "@t/House";
import { setter } from "@lib/setter";
import { RequestData } from "@lib/fetch";
import forms from "css/forms.module.scss";

interface Props {
  house: House | null;
  updateHouseById(id: string, data: RequestData): Promise<boolean>;
}

const AdminIndex = ({ house, updateHouseById }: Props) => {
  const [currency, setCurrency] = React.useState("");
  const [state, setState] = React.useState<"loading" | null>(null);

  const router = useRouter();
  const { loading, hasAccess } = useHasAccess(UserRole.ADMIN);
  useIsAuth();
  useValidHouse();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!house) return;

    setState("loading");

    await updateHouseById(house.id, { name: house.name, currency });

    setState(null);
  }

  React.useEffect(() => {
    if (house) {
      setCurrency(house.currency);
    }
  }, [house]);

  React.useEffect(() => {
    if (!loading && !hasAccess) {
      router.push("/404");
    }
  }, [loading, hasAccess, router]);

  return (
    <AdminLayout>
      <Head>
        <title>Manage categories - Inventory</title>
      </Head>

      <div>
        <h1>General Settings</h1>

        <form style={{ marginTop: "1rem" }} onSubmit={onSubmit}>
          <div className={forms.formGroup}>
            <label htmlFor="currency">Currency</label>
            <input
              id="currency"
              placeholder="€"
              value={currency}
              onChange={setter(setCurrency)}
              className={forms.formInput}
            />
          </div>

          <button disabled={loading} style={{ float: "right" }} type="submit" className="btn">
            {state ? "loading.." : "Save changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const store = initializeStore();
  const cookie = ctx.req.headers.cookie;
  const houseId = ctx.query.houseId as string;

  await checkAuth(cookie)(store.dispatch);
  await getCurrentHouse(houseId, cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  house: state.houses.house,
});

export default connect(mapToProps, { updateHouseById })(AdminIndex);

import * as React from "react";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { AppProps } from "next/app";
import { NextPage } from "next";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "react-hot-toast";

import "css/fonts.scss";
import "css/nprogress.scss";
import "css/table.scss";
import "css/index.scss";

import { useStore } from "../store/store";
import { RateLimitedModal } from "@components/modals/RateLimited";
import { getTheme, setThemeClass } from "@lib/theme";

const toastStyles: React.CSSProperties = {
  minWidth: "300px",
  maxWidth: "95%",
  padding: "0.5rem 0.8rem",
  fontSize: "1rem",

  background: "var(--modal-bg)",
  color: "var(--dark)",
};

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const store = useStore(pageProps?.initialReduxState);

  React.useEffect(() => {
    function startHandler() {
      NProgress.start();
    }

    function doneHandler() {
      NProgress.done();
    }

    Router.events.on("routeChangeStart", startHandler);
    Router.events.on("routeChangeComplete", doneHandler);
    Router.events.on("routeChangeError", doneHandler);

    return () => {
      Router.events.off("routeChangeStart", startHandler);
      Router.events.off("routeChangeComplete", doneHandler);
      Router.events.off("routeChangeError", doneHandler);
    };
  });

  React.useEffect(() => {
    const t = getTheme();
    setThemeClass(t);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Toaster
        position="top-right"
        toastOptions={{
          style: toastStyles,
          error: {
            style: { fontWeight: 500 },
          },
        }}
      />

      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>

      <RateLimitedModal />
    </>
  );
};

export default App;

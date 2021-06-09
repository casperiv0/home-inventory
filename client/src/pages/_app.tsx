import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { AppProps } from "next/app";
import { NextPage } from "next";
import { Provider as ReduxProvider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "css/nprogress.scss";
import "css/table.scss";
import "css/index.scss";
// import "css/fonts.css";

import { useStore } from "../store/store";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const store = useStore(pageProps?.initialReduxState);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ToastContainer pauseOnFocusLoss={false} position="bottom-right" />

      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </>
  );
};

export default App;

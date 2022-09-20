import * as React from "react";
import { trpc } from "utils/trpc";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Layout } from "components/ui/Layout";

import "styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  const sessionQuery = trpc.user.getSession.useQuery();

  return (
    <SessionProvider session={sessionQuery.data?.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);

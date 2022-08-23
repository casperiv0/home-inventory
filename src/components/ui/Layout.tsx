import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import { trpc } from "utils/trpc";
import { Loader } from "./Loader";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const sessionQuery = trpc.useQuery(["user.getSession"]);
  const router = useRouter();

  React.useEffect(() => {
    if (router.pathname === "_error") return;

    if (!sessionQuery.data && !sessionQuery.isLoading && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [sessionQuery, router]);

  if ((sessionQuery.isLoading || !sessionQuery.data) && router.pathname !== "/login") {
    return <Loader fixed />;
  }

  return (
    <>
      <Head>
        <title>Home Inventory</title>

        <link rel="preload" href="/fonts/Raleway-VF.ttf" as="font" type="font/ttf" crossOrigin="" />
        <link
          rel="preload"
          href="/fonts/RobotoSlab-VF.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <meta name="description" content="" />
      </Head>

      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">{children}</main>
    </>
  );
}

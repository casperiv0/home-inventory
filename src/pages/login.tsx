import { Button } from "components/ui/Button";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { Google } from "react-bootstrap-icons";

export default function LoginPage() {
  function handleLoginClick() {
    signIn("google", { redirect: true, callbackUrl: "/" });
  }

  return (
    <div className="p-10">
      <Head>
        <title>Home Inventory - Login</title>
      </Head>

      <header>
        <h1 className="text-4xl font-serif">Sign In</h1>
        <p className="mt-3 text-neutral-300">
          Sign in to continue. Once authenticated, you can manage your houses, products and more.
        </p>
      </header>

      <div className="mt-6">
        <Button onClick={handleLoginClick} className="flex items-center gap-2">
          <Google />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

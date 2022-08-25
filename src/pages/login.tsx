import { Button } from "components/ui/Button";
import { signIn } from "next-auth/react";
import { Google } from "react-bootstrap-icons";

export default function LoginPage() {
  function handleLoginClick() {
    signIn("google", { redirect: true, callbackUrl: "/" });
  }

  return (
    <div className="p-10">
      <header>
        <h1 className="text-4xl font-serif">Sign In</h1>
        <p className="mt-3 text-neutral-400">
          Sign in to continue. Once authenticated, you can manage your houses, products and more.
        </p>
      </header>

      <div className="mt-6">
        <Button variant="accent" onClick={handleLoginClick} className="flex items-center gap-2">
          <Google />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

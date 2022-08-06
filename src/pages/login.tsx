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
        <h1 className="text-4xl font-serif">Login</h1>
        <p className="mt-3 text-neutral-700">
          Login to continue to manage your expenses, income and subscriptions
        </p>
      </header>

      <div className="mt-4">
        <Button onClick={handleLoginClick} className="flex items-center gap-2">
          <Google />
          Login via Google
        </Button>
      </div>
    </div>
  );
}

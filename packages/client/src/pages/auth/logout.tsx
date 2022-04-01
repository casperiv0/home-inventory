import * as React from "react";
import { logout } from "@actions/auth";
import { useRouter } from "next/router";
import { connect } from "react-redux";

interface Props {
  logout(): Promise<boolean>;
}

const LogoutPage = ({ logout }: Props) => {
  const router = useRouter();

  const func = React.useCallback(async () => {
    await logout();

    router.push("/auth/login");
  }, [logout, router]);

  React.useEffect(() => {
    func();
  }, [func]);

  return <div>Logging you out...</div>;
};

export default connect(null, { logout })(LogoutPage);

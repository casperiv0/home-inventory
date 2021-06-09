import { logout } from "@actions/auth";
import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";

interface Props {
  logout: () => void;
}

const LogoutPage = ({ logout }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    logout();

    router.push("/");
  }, [logout, router]);

  return <div>Logging you out...</div>;
};

export default connect(null, { logout })(LogoutPage);

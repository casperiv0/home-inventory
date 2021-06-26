import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

import { authenticate } from "@actions/auth";
import styles from "css/forms.module.scss";
import { RequestData } from "@lib/fetch";
import { setter } from "@lib/setter";

interface Props {
  authenticate: (data: RequestData, login?: boolean) => Promise<boolean>;
}

const LoginPage = ({ authenticate }: Props) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const success = await authenticate({ email, password }, true);

    if (success === true) {
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <div className={styles.authContainer}>
      <Head>
        <title>Login - Inventory</title>
      </Head>

      <form onSubmit={onSubmit} className={styles.authForm}>
        <h1>Log in to continue</h1>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            className={styles.formInput}
            id="email"
            type="email"
            value={email}
            onChange={setter(setEmail)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            id="password"
            type="password"
            value={password}
            onChange={setter(setPassword)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Link href="/auth/register">
            <a>Register</a>
          </Link>
          <button
            style={{ marginLeft: "1rem" }}
            disabled={isLoading}
            className={styles.submitBtn}
            type="submit"
          >
            {isLoading ? "loading.." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { authenticate })(LoginPage);

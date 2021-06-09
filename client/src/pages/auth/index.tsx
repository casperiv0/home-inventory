import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import { authenticate } from "@actions/auth";
import styles from "css/forms.module.scss";
import { RequestData } from "@lib/fetch";

interface Props {
  authenticate: (data: RequestData) => Promise<boolean>;
}

const AuthPage = ({ authenticate }: Props) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const success = await authenticate({ email, password, name: "N/A" });

    if (success === true) {
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <div className={styles.authContainer}>
      <Head>
        <title>Authentication - Inventory</title>
      </Head>

      <form onSubmit={onSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            className={styles.formInput}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button disabled={isLoading} className={styles.submitBtn} type="submit">
            {isLoading ? "loading.." : "Authenticate"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { authenticate })(AuthPage);

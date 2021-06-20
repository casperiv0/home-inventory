import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import { authenticate } from "@actions/auth";
import styles from "css/forms.module.scss";
import { RequestData } from "@lib/fetch";
import { setter } from "@lib/setter";

interface Props {
  authenticate: (data: RequestData) => Promise<boolean>;
}

const RegisterPage = ({ authenticate }: Props) => {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const success = await authenticate({ email, password, name });

    if (success === true) {
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <div className={styles.authContainer}>
      <Head>
        <title>Register - Inventory</title>
      </Head>

      <form onSubmit={onSubmit} className={styles.authForm}>
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
          <label htmlFor="name">Name</label>
          <input
            className={styles.formInput}
            id="name"
            type="text"
            value={name}
            onChange={setter(setName)}
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

        <div>
          <button disabled={isLoading} className={styles.submitBtn} type="submit">
            {isLoading ? "loading.." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { authenticate })(RegisterPage);

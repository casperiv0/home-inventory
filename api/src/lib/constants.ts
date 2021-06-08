import { genSaltSync } from "bcryptjs";

export const AuthConstants = {
  saltRounds: genSaltSync(15),

  /**
   * cookie expires after 6 hours
   */
  cookieExpires: 60 * 60 * 1000 * 6,

  cookieName: "session-cookie",
};

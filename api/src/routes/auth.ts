import { Router } from "express";
import { compareSync, hashSync } from "bcryptjs";
import { prisma } from "../index";
import { authenticateSchema } from "../schemas/auth.schema";
import { createYupSchema } from "../utils/createYupSchema";
import { AuthConstants } from "../lib/constants";
import { createSessionToken, setCookie } from "../lib/auth.lib";

const authRouter = Router();

/**
 * no login/register routes
 *
 * - only allow an admin to add other users
 */
authRouter.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const schema = createYupSchema(authenticateSchema);
  const isValid = await schema.isValid({ email, password });

  if (!isValid) {
    const error = await schema.validate({ email, password }).catch((e) => e);

    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const usersLength = await prisma.user.count();
  let user;

  /**
   * no users created yet? Create the first user as admin
   */
  if (usersLength === 0) {
    const hash = hashSync(password, AuthConstants.saltRounds);

    user = await prisma.user.create({
      data: { email, password: hash },
      select: { email: true, id: true },
    });
  } else {
    user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        error: "User was not found",
        status: "error",
      });
    }

    const isPwCorrect = compareSync(password, user.password);
    if (!isPwCorrect) {
      return res.status(400).json({
        error: "Password is invalid",
        status: "error",
      });
    }
  }

  if (!user) {
    return res.status(500).json({
      error: "An error occurred",
      status: "error",
    });
  }

  const token = createSessionToken(user.id);
  setCookie(token, res);

  return res.json({
    status: "success",
    userId: user.id,
  });
});

/**
 * set a new password for the current authenticated user.
 * @todo add this function
 */
// authRouter.post("/new-password", async (req, res) => {

// })

export default authRouter;

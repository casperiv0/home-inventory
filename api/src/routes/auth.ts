import { Router } from "express";
import { compareSync, hashSync } from "bcryptjs";
import { prisma } from "../index";
import { authenticateSchema, newPasswordSchema } from "@schemas/auth.schema";
import { AuthConstants } from "@lib/constants";
import { createSessionToken, setCookie } from "@lib/auth.lib";
import { withAuth } from "@hooks/withAuth";
import { IRequest } from "@t/IRequest";
import { validateSchema } from "@utils/validateSchema";

const router = Router();

/**
 * no login/register routes
 *
 * - only allow an admin to add other users
 */
router.post("/authenticate", async (req, res) => {
  const { email, name, password } = req.body;

  const [error] = await validateSchema(authenticateSchema, { email, name, password });

  if (error) {
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
      data: { name, email, password: hash, role: "ADMIN" },
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

router.post("/user", withAuth, async (req: IRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return res.json({ user });
});

/**
 * set a new password for the current authenticated user.
 * @todo add this function
 */
router.post("/new-password", withAuth, async (req: IRequest, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const [error] = await validateSchema(newPasswordSchema, {
    oldPassword,
    newPassword,
    confirmPassword,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  if (confirmPassword !== newPassword) {
    return res.status(400).json({
      error: "New passwords do not match",
      status: "error",
    });
  }
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });

  const isOldPasswordCorrect = compareSync(oldPassword, user?.password!);

  if (!isOldPasswordCorrect) {
    return res.status(400).json({
      error: "Old password does not match",
      status: "error",
    });
  }

  return res.json({
    message: "TODO",
  });
});

export const authRouter = router;

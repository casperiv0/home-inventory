import { Response, Router } from "express";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { validateSchema } from "@casper124578/utils";
import { prisma } from "@lib/prisma";
import { authenticateSchema, newPasswordSchema } from "@schemas/auth.schema";
import { AuthConstants } from "@lib/constants";
import {
  createSessionToken,
  createUserAndLinkHouse,
  getSessionUser,
  setCookie,
  validateUserPassword,
} from "@lib/auth.lib";
import { withAuth } from "@hooks/withAuth";
import { IRequest } from "@t/IRequest";
import { redisDel, redisSet } from "@lib/redis";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const [error] = await validateSchema(authenticateSchema(true), {
    email,
    name,
    password,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    return res.status(404).json({
      error: "That email is already in-use. Please specify a different email.",
      status: "error",
    });
  }

  const hash = hashSync(password, genSaltSync(15));

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  await createUserAndLinkHouse(createdUser);

  const token = createSessionToken(createdUser.id);
  setCookie(token, res);

  return res.json({ userId: createdUser.id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [error] = await validateSchema(authenticateSchema(false), {
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
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

  const token = createSessionToken(user.id);
  setCookie(token, res);

  return res.json({ userId: user.id });
});

router.post("/user", withAuth, async (req: IRequest, res) => {
  const user = await getSessionUser(req.userId!);

  return res.json({ user });
});

router.put("/user", withAuth, async (req: IRequest, res: Response) => {
  const body = req.body;

  const [error] = await validateSchema(authenticateSchema(true), body);

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const isPwCorrect = await validateUserPassword(req.userId!, req.body.password);

  if (!isPwCorrect) {
    return res.status(400).json({
      error: "Password does not match",
      status: "error",
    });
  }

  const user = await prisma.user.update({
    where: {
      id: req.userId!,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
    },
    select: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
      houseRoles: { select: { role: true, houseId: true, userId: true } },
      houses: { select: { name: true, id: true } },
    },
  });

  await redisSet(req.userId!, JSON.stringify(user));

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

router.post("/logout", withAuth, async (req: IRequest, res: Response) => {
  await redisDel(req.userId!);

  req.userId = "";

  res.clearCookie(AuthConstants.cookieName);

  return res.status(200).json({ status: "success" });
});

export const authRouter = router;

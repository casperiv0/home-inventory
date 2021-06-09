import { Router } from "express";
import { hashSync } from "bcryptjs";
import { withAuth } from "@hooks/withAuth";
import { withPermission } from "@hooks/withPermission";
import { prisma } from "src/index";
import { createUserSchema, updateUserSchema } from "@schemas/user.schema";
import { AuthConstants } from "@lib/constants";
import { validateSchema } from "@utils/validateSchema";

const router = Router();

router.post("/", withAuth, withPermission("ADMIN"), async (req, res) => {
  const body = req.body;

  const [error] = await validateSchema(createUserSchema, body);

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email } });

  if (existing) {
    return res.status(400).json({
      error: "A user with that email already exists.",
      status: "error",
    });
  }

  await prisma.user.create({
    data: {
      password: hashSync(body.password, AuthConstants.saltRounds),
      name: body.name,
      email: body.email,
      role: body.role,
    },
  });

  const users = await prisma.user.findMany({
    select: { name: true, id: true, email: true, role: true },
  });

  return res.json({ users });
});

router.get("/", withAuth, withPermission("ADMIN"), async (_, res) => {
  const users = await prisma.user.findMany({
    select: { name: true, email: true, id: true, role: true },
  });

  return res.json({ users });
});

router.put("/:id", withAuth, withPermission("ADMIN"), async (req, res) => {
  const id = req.params.id as string;
  const body = req.body;

  const [error] = await validateSchema(updateUserSchema, body);

  if (error) {
    return res.status(400).json({
      error: error.message,
      status: "error",
    });
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).json({
      error: "User was not found",
      status: "error",
    });
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: body.role,
      name: body.name,
    },
  });

  const users = await prisma.user.findMany({
    select: { name: true, id: true, email: true, role: true },
  });

  return res.json({ users });
});

router.delete("/:id", withAuth, withPermission("ADMIN"), async (req, res) => {
  const id = req.params.id as string;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return res.status(400).json({
      error: "User was not found",
      status: "error",
    });
  }

  await prisma.user.delete({ where: { id } });

  const users = await prisma.user.findMany({
    select: { name: true, id: true, email: true, role: true },
  });

  return res.json({ users });
});

export const usersRouter = router;

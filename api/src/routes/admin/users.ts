import { Router } from "express";
import { withAuth } from "@hooks/withAuth";
import { withPermission } from "@hooks/withPermission";
import { prisma } from "src/index";
import { updateUserSchema } from "@schemas/user.schema";
import { createYupSchema } from "@utils/createYupSchema";

const router = Router();

router.get("/", withAuth, withPermission("ADMIN"), async (_, res) => {
  const users = await prisma.user.findMany({
    select: { name: true, email: true, id: true, role: true },
  });

  return res.json({ users });
});

router.put("/:id", withAuth, withPermission("ADMIN"), async (req, res) => {
  const id = req.params.id as string;
  const body = req.body;

  const schema = createYupSchema(updateUserSchema);
  const error = await schema
    .validate(body)
    .then(() => null)
    .catch((e) => e);

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

  const updated = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: body.role,
      name: body.name,
    },
    select: {
      name: true,
      email: true,
      id: true,
      role: true,
    },
  });

  return res.json({ user: updated });
});

export const usersRouter = router;

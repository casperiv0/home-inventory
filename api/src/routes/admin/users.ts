import { Router } from "express";
import { hashSync } from "bcryptjs";
import { UserRole } from "@prisma/client";
import { withAuth } from "@hooks/withAuth";
import { withPermission } from "@hooks/withPermission";
import { prisma } from "src/index";
import { createUserSchema, updateUserSchema } from "@schemas/user.schema";
import { AuthConstants } from "@lib/constants";
import { validateSchema } from "@utils/validateSchema";
import { withValidHouseId } from "@hooks/withValidHouseId";

const router = Router();

async function getUsers(houseId: string | undefined) {
  const data = await prisma.house.findUnique({
    where: {
      id: houseId,
    },
    select: {
      users: {
        select: {
          name: true,
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  return data?.users ?? [];
}

router.post("/:houseId", withAuth, withValidHouseId, withPermission("ADMIN"), async (req, res) => {
  try {
    const body = req.body;
    const houseId = req.params.houseId as string;

    const [error] = await validateSchema(createUserSchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });

    /**
     * if there's already a user with the same email, update the user's houses
     * otherwise create a new user in the house.
     */
    if (existing) {
      await prisma.house.update({
        where: {
          id: houseId,
        },
        data: {
          users: {
            connect: {
              id: existing.id,
            },
          },
        },
      });
    } else {
      await prisma.house.update({
        where: {
          id: houseId,
        },
        data: {
          users: {
            create: {
              password: hashSync(body.password, AuthConstants.saltRounds),
              name: body.name,
              email: body.email,
              role: body.role,
              houseId,
            },
          },
        },
      });
    }

    const users = await getUsers(houseId);
    return res.json({ users });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.get("/:houseId", withAuth, withValidHouseId, withPermission("ADMIN"), async (req, res) => {
  const users = await getUsers(req.params.houseId);
  return res.json({ users });
});

router.put(
  "/:houseId/:id",
  withAuth,
  withValidHouseId,
  withPermission("ADMIN"),
  async (req, res) => {
    try {
      const id = req.params.id as string;
      const houseId = req.params.houseId as string;
      const body = req.body;

      const [error] = await validateSchema(updateUserSchema, body);

      if (error) {
        return res.status(400).json({
          error: error.message,
          status: "error",
        });
      }

      const user = await prisma.user.findFirst({ where: { id, houseId } });

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

      const users = await getUsers(houseId);
      return res.json({ users });
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        error: "An unexpected error has occurred. Please try again later",
        status: "error",
      });
    }
  },
);

router.delete(
  "/:houseId/:id",
  withAuth,
  withValidHouseId,
  withPermission("ADMIN"),
  async (req, res) => {
    try {
      const id = req.params.id as string;
      const houseId = req.params.houseId as string;

      const user = await prisma.user.findFirst({
        where: { id, houseId },
      });

      if (!user) {
        return res.status(400).json({
          error: "User was not found",
          status: "error",
        });
      }

      if (user.role === UserRole.OWNER) {
        return res.status(403).json({
          error: "Cannot delete the owner's account",
          status: "error",
        });
      }

      await prisma.house.deleteMany({ where: { userId: id } });
      await prisma.product.deleteMany({ where: { userId: id } });

      await prisma.user.deleteMany({ where: { id } });

      const users = await getUsers(houseId);
      return res.json({ users });
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        error: "An unexpected error has occurred. Please try again later",
        status: "error",
      });
    }
  },
);

export const usersRouter = router;

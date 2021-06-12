import { Router } from "express";
import { withAuth } from "@hooks/withAuth";
import { withPermission } from "@hooks/withPermission";
import { prisma } from "src/index";
import { createUserSchema, updateUserSchema } from "@schemas/user.schema";
import { validateSchema } from "@utils/validateSchema";
import { withValidHouseId } from "@hooks/withValidHouseId";
import { getCurrentHouseRole } from "@utils/getCurrentHouseRole";
import { UserRole } from "@prisma/client";

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
          createdAt: true,
          houseRoles: {
            select: {
              id: true,
              role: true,
              houseId: true,
            },
          },
        },
      },
    },
  });

  if (!data) return [];

  return data.users.map((user) => {
    user.houseRoles = user.houseRoles.filter((r) => r.houseId === houseId);

    return user;
  });
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

    /**
     * a house can only have 1 owner.
     */
    if (body.role === UserRole.OWNER) {
      return res.status(403).json({
        error: "Please specify a different role.",
        status: "error",
      });
    }

    const alreadyPartOfHouse = await prisma.user.findFirst({
      where: {
        email: body.email,
        houseId,
      },
    });

    /**
     * if the user is already part of the house
     * don't allow them to be re-added
     */
    if (alreadyPartOfHouse) {
      return res.status(400).json({
        error: "This user is already part of this house.",
        status: "error",
      });
    }

    /**
     * find the provided user to add to the house
     */
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return res.status(404).json({
        error: "User was not found",
        status: "error",
      });
    }

    /**
     * update the user to add the "houseRoles"
     */
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        houseRoles: {
          create: {
            houseId,
            role: body.role,
          },
        },
      },
    });

    /**
     * update the house to connect the provided user
     */
    await prisma.house.update({
      where: {
        id: houseId,
      },
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
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
      const currentRole = await getCurrentHouseRole(id, houseId);

      if (!user || !currentRole) {
        return res.status(404).json({
          error: "User was not found",
          status: "error",
        });
      }

      /**
       * the owner's role should not be allowed to be updated.
       */
      if (currentRole?.role === UserRole.OWNER && body.role !== currentRole.role) {
        return res.status(403).json({
          error: "Cannot update the owner's role.",
          status: "error",
        });
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          name: body.name,
          houseRoles: {
            update: {
              where: { id: currentRole.id },
              data: {
                role: body.role,
              },
            },
          },
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

      const currentRole = await getCurrentHouseRole(id, houseId);

      /**
       * the owner's account cannot be deleted
       */
      if (currentRole?.role === UserRole.OWNER) {
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

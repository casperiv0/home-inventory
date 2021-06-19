import { Router } from "express";
import { UserRole } from "@prisma/client";
import { validateSchema } from "@casper124578/utils";
import { withAuth } from "@hooks/withAuth";
import { IRequest } from "@t/IRequest";
import { prisma } from "src/index";
import { createHouseSchema } from "@schemas/house.schema";

const router = Router();

async function returnHouseByUserId(userId: string | undefined) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      houses: {
        select: {
          name: true,
          id: true,
          houseRoles: { select: { id: true, role: true, userId: true } },
          users: {
            select: { name: true },
          },
          products: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return userData?.houses ?? [];
  // return prisma.house.findMany({
  //   where: { userId: userId! },
  //   select: {
  //     name: true,
  //     id: true,
  //     users: {
  //       select: {
  //         name: true,
  //         email: true,
  //         id: true,
  //
  //       },
  //     },
  //     products: { select: { name: true, id: true } },
  //   },
  // });
}

router.get("/", withAuth, async (req: IRequest, res) => {
  const houses = await returnHouseByUserId(req.userId);

  return res.json({ houses });
});

router.get("/:id", withAuth, async (req, res) => {
  try {
    const id = req.params.id as string;

    const house = await prisma.house.findUnique({
      where: { id },
    });

    if (!house) {
      return res.status(404).json({
        error: "House was not found",
        status: "error",
      });
    }

    return res.json({ house });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.post("/", withAuth, async (req: IRequest, res) => {
  try {
    const body = req.body;

    const [error] = await validateSchema(createHouseSchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }

    const existing = await prisma.house.findUnique({
      where: { name: body.name },
    });

    if (existing) {
      return res.status(400).json({
        error: "House name is already in-use. Please specify a different house name",
      });
    }

    const house = await prisma.house.create({
      data: {
        name: body.name,
        userId: req.userId!,
        houseRoles: {
          create: {
            role: UserRole.OWNER,
            userId: req.userId!,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: req.userId!,
      },
      data: {
        houses: {
          connect: {
            id: house.id,
          },
        },
      },
    });

    const houses = await returnHouseByUserId(req.userId);

    return res.json({ houses });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.put("/:id", withAuth, async (req: IRequest, res) => {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const [error] = await validateSchema(createHouseSchema, body);

    if (error) {
      return res.status(400).json({
        error: error.message,
        status: "error",
      });
    }
    const house = await prisma.house.findUnique({ where: { id } });

    if (!house) {
      return res.status(404).json({
        error: "House was not found",
        status: "error",
      });
    }

    await prisma.house.update({
      where: {
        id,
      },
      data: {
        name: body.name,
      },
    });

    const houses = await returnHouseByUserId(req.userId);

    return res.json({ houses });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

router.delete("/:id", withAuth, async (req: IRequest, res) => {
  try {
    const id = req.params.id as string;

    await prisma.house.delete({ where: { id } });

    const houses = await returnHouseByUserId(req.userId);

    return res.json({ houses });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
});

export const housesRouter = router;

import { UserRole } from "@prisma/client";
import { NextFunction, Response } from "express";
import { IRequest } from "@t/IRequest";
import { prisma } from "src";

export const withPermission =
  (providedRole: UserRole) => async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    const currentHouse = await prisma.house.findUnique({
      where: { id: req.params.houseId },
      select: { houseRoles: { select: { id: true, userId: true, role: true, houseId: true } } },
    });

    const roles = {
      OWNER: 3,
      ADMIN: 2,
      USER: 1,
    };

    const role = roles[providedRole];

    if (!role) {
      return res.status(403).json({
        error: "Invalid role.",
      });
    }

    const currentUserRole = currentHouse?.houseRoles.find(
      (r) => r.userId === currentUser?.id && r.houseId === req.params.houseId,
    );

    if (!currentUserRole) {
      return res.status(403).json({
        error: "Not part of this house.",
        status: "error",
      });
    }

    if (roles[currentUserRole!.role] < role) {
      return res.status(403).json({
        error: "Invalid role.",
      });
    }

    return next();
  };

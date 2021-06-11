import { UserRole } from "@prisma/client";
import { NextFunction, Response } from "express";
import { IRequest } from "@t/IRequest";
import { prisma } from "src";

export const withPermission =
  (providedRole: UserRole) => async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId! },
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

    if (roles[currentUser!.role] < role) {
      return res.status(403).json({
        error: "Invalid role.",
      });
    }

    return next();
  };

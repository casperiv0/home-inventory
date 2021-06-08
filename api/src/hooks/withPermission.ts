import { UserRole } from "@prisma/client";
import { NextFunction, Response } from "express";
import { IRequest } from "@t/IRequest";
import { prisma } from "src";

export const withPermission =
  (role: UserRole) => async (req: IRequest, res: Response, next: NextFunction) => {
    const currentUser = await prisma.user.findUnique({ where: { id: req.userId! } });

    if (currentUser?.role !== role) {
      return res.status(403).json({
        error: "Invalid role.",
      });
    }

    return next();
  };

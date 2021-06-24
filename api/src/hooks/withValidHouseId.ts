import { IRequest } from "@t/IRequest";
import { NextFunction, Response } from "express";
import { prisma } from "src";

/**
 * check if the router houseId is a valid houseId
 */
export async function withValidHouseId(req: IRequest, res: Response, next: NextFunction) {
  try {
    const house = await prisma.house.findUnique({
      where: { id: req.params.houseId! },
    });

    if (!house) {
      return res.status(404).json({
        error: "The provided house was not found",
        status: "error",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: req.userId },
      select: { houses: { select: { id: true } }, id: true },
    });

    if (!user) {
      return res.status(404).json({
        error: "user was not found",
        status: "error",
      });
    }

    if (!user.houses.find((v) => v.id === house.id)) {
      return res.status(404).json({
        error: "The provided house was not found",
        status: "error",
      });
    }

    return next();
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "An unexpected error has occurred. Please try again later",
      status: "error",
    });
  }
}

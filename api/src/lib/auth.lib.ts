import { User, UserRole } from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "src";
import { AuthConstants } from "./constants";

export function createSessionToken(userId: string) {
  return jwt.sign(userId, process.env["JWT_SECRET"] as string);
}

export function setCookie(token: string, res: Response) {
  res.cookie(AuthConstants.cookieName, token, {
    httpOnly: true,
    expires: new Date(Date.now() + AuthConstants.cookieExpires),
  });
}

export async function createUserAndLinkHouse(createdUser: User) {
  try {
    /**
     * once the user account is created
     *
     * - create a house with a default name "First home"
     * - connect the user account to the house
     */
    const house = await prisma.house.create({
      data: {
        name: "First home",
        userId: createdUser.id,
        users: {
          connect: {
            id: createdUser.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        users: { select: { email: true, id: true } },
      },
    });

    /**
     * update the user with the new houseId
     * and create the UserRole
     */
    await prisma.user.update({
      where: {
        id: createdUser.id,
      },
      data: {
        houseId: house.id,
        houseRoles: {
          create: {
            houseId: house.id,
            role: UserRole.OWNER,
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
  }
}

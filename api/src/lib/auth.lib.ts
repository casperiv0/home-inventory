import * as redis from "./redis";
import { User, UserRole } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@lib/prisma";
import { AuthConstants } from "./constants";

export function createSessionToken(userId: string) {
  return jwt.sign(userId, process.env["JWT_SECRET"] as string);
}

export function setCookie(token: string, res: Response) {
  const options: CookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + AuthConstants.cookieExpires),
  };

  if (process.env["NODE_ENV"] === "production") {
    options.sameSite = "lax";
    options.secure = true;
  }

  res.cookie(AuthConstants.cookieName, token, options);
}

export async function validateUserPassword(userId: string, passwordStr: string) {
  const data = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });

  if (!data) {
    return false;
  }

  return compareSync(passwordStr, data.password);
}

export async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
      houseRoles: { select: { role: true, houseId: true, userId: true } },
      houses: { select: { name: true, id: true } },
    },
  });
}

/**
 * get the authenticated user from the db or redis cache
 * @param userId The userId of the authenticated user
 */
export async function getSessionUser(
  userId: string,
): Promise<Omit<User, "password" | "houseId"> | null> {
  const cache = await redis.get(userId);
  if (!cache) {
    const user = await getUser(userId);

    if (!user) {
      redis.del(userId);
      return null;
    }

    redis.set(userId, JSON.stringify(user));
    return user;
  }

  try {
    return JSON.parse(cache);
  } catch {
    return null;
  }
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

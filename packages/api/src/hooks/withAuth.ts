import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IRequest } from "@t/IRequest";
import { AuthConstants } from "@lib/constants";
import { getSessionUser } from "@lib/auth.lib";

/**
 * check if someone is authenticated
 */
export async function withAuth(
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  const token = req.cookies[AuthConstants.cookieName] || req.headers.session;
  const secret = process.env["JWT_SECRET"] as string;

  if (!token) {
    return res.status(401).json({ error: "invalid token", status: "error" });
  }

  try {
    const vToken = jwt.verify(token, secret);
    const user = await getSessionUser(vToken as string);

    if (!user) {
      return res.status(401).json({
        error: "User was not found",
        status: "error",
      });
    }

    req.userId = user.id;

    return next();
  } catch (e) {
    console.error(e);

    return res.status(401).json({ error: "invalid token", status: "error" });
  }
}

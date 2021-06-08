import { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthConstants } from "./constants";

export function createSessionToken(userId: string) {
  return jwt.sign(userId, process.env["JWT_SECRET"] as string);
}

export function setCookie(token: string, res: Response) {
  res.cookie(AuthConstants.cookieName, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    expires: new Date(Date.now() + AuthConstants.cookieExpires),
  });
}

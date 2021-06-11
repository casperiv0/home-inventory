import { Request, Response } from "express";

export function notFoundMiddleware(_: Request, res: Response) {
  res.status(404).json({
    message: "Route not found",
    status: "error",
  });
}

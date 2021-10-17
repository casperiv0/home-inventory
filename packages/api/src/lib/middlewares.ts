import { NextFunction, Request, Response } from "express";

// 10 megabytes
const MAX_FILE_SIZE = 10_000_000;

export function notFoundMiddleware(_: Request, res: Response) {
  res.status(404).json({
    message: "Route not found",
    status: "error",
  });
}

export function fileSizeLimit(req: Request, res: Response, next: NextFunction) {
  // `as boolean` because TS is being weird???
  let invalid = false as boolean;

  if (req.files && typeof req.files === "object") {
    Object.entries(req.files).forEach(([, file]) => {
      if (Array.isArray(file)) {
        file.map((f) => {
          if (f.size > MAX_FILE_SIZE) {
            invalid = true;
          }
        });
      } else {
        if (file.size > MAX_FILE_SIZE) {
          invalid = true;
        }
      }
    });
  }

  if (invalid === true) {
    return res.status(400).json({ error: "File size must be below 10MB." });
  }

  return next();
}

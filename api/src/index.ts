import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import express from "express";

import helmet from "helmet";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

import apiRouter from "./routes/api";
import { logger } from "./utils/logger";

const server = express();

server.use(compression());
server.use(express.json());
server.use(helmet());
server.use(cookieParser());
server.use(cors({ origin: process.env["CORS_ORIGIN_URL"] as string, credentials: true }));
server.use("/api", apiRouter, csurf({ cookie: true }));

server.use((_, res) => {
  res.status(404).json({
    message: "Route not found",
    status: "error",
  });
});

server.listen(parseInt(process.env["API_PORT"] as string), () => {
  logger.log("API", `Woop woop! API is listening on port ${process.env["API_PORT"]}`);
});

export const prisma = new PrismaClient({});

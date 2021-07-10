import "dotenv/config";
import express from "express";

import helmet from "helmet";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";

import apiRouter from "./routes/api";
import { logger } from "@utils/logger";
import { fileSizeLimit, notFoundMiddleware } from "@lib/middlewares";

const server = express();

server.disable("x-powered-by");
server.use(cookieParser());
server.use(
  cors({
    origin: [process.env["CORS_ORIGIN_URL"] as string],
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE", "HEAD"],
  }),
);
server.use(compression());
server.use(express.json());
server.use(helmet());
server.use(fileUpload({ safeFileNames: true }));
server.use(
  rateLimit({
    // max 50 requests per 1 minute
    max: 50,
    skip: (req) => {
      const { method, path } = req;

      if (method === "POST" && path === "/api/auth/user") return true;
      if (method === "GET" && path.startsWith("/api/houses")) return true;
      if (method === "GET" && path.endsWith("/products")) return true;

      return false;
    },
  }),
);
server.use(fileSizeLimit);

server.use("/api", apiRouter, csurf({ cookie: true }));
server.use(notFoundMiddleware);

server.listen(parseInt(process.env["API_PORT"] as string), () => {
  logger.log("API", `Woop woop! API is listening at http://localhost:${process.env["API_PORT"]}`);
});

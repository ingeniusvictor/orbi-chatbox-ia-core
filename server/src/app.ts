import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import type { ServerRuntimeEnv } from "./config/env.js";
import { createAuditLog } from "./middleware/auditLog.js";
import { createCorsGuard } from "./middleware/corsGuard.js";
import { createRateLimitGuard } from "./middleware/rateLimitGuard.js";
import { healthRouter } from "./routes/health.js";
import { createWidgetMessageRouter } from "./routes/widgetMessage.js";

export const createApp = (runtimeEnv: ServerRuntimeEnv): express.Express => {
  const app = express();

  app.use(express.json({ limit: "64kb" }));
  app.use(createCorsGuard(runtimeEnv.allowedOrigins));
  app.use(
    "/api/public/widget",
    createRateLimitGuard(runtimeEnv.rateLimitWindowMs, runtimeEnv.rateLimitMaxRequests),
  );
  app.use(createAuditLog(runtimeEnv.auditLogEnabled));
  app.use(healthRouter);
  app.use(createWidgetMessageRouter(runtimeEnv.demoWidgetPublicKey));

  const notFoundHandler: RequestHandler = (_request, response) => {
    response.status(404).json({
      ok: false,
      mode: "sandbox",
      message: "Route not found.",
    });
  };

  const errorHandler: ErrorRequestHandler = (_error, _request, response, _next) => {
    response.status(500).json({
      ok: false,
      mode: "sandbox",
      message: "Unexpected sandbox server error.",
    });
  };

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import type { ServerRuntimeEnv } from "./config/env.js";
import { createAuditLog } from "./middleware/auditLog.js";
import { createCorsGuard } from "./middleware/corsGuard.js";
import { createRateLimitGuard } from "./middleware/rateLimitGuard.js";
import { healthRouter } from "./routes/health.js";
import { createWidgetMessageRouter } from "./routes/widgetMessage.js";
import { createVoiceRouter } from "./routes/voice.js";
import { createSandboxError } from "./security/errorResponses.js";

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
  app.use(createVoiceRouter());
  app.use(createWidgetMessageRouter(runtimeEnv.demoWidgetPublicKey, runtimeEnv.activeAiProvider));

  const notFoundHandler: RequestHandler = (_request, response) => {
    const error = createSandboxError(404, "ROUTE_NOT_FOUND", "Route not found.");
    response.status(error.statusCode).json(error.body);
  };

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof SyntaxError && "status" in error && error.status === 400) {
      const invalidJson = createSandboxError(400, "INVALID_JSON_BODY", "Request body must contain valid JSON.");
      response.status(invalidJson.statusCode).json(invalidJson.body);
      return;
    }

    const sandboxError = createSandboxError(
      500,
      "INTERNAL_SANDBOX_ERROR",
      "Unexpected sandbox server error.",
    );
    response.status(sandboxError.statusCode).json(sandboxError.body);
  };

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

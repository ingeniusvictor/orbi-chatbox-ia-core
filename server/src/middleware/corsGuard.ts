import type { RequestHandler } from "express";
import { createSandboxError } from "../security/errorResponses.js";

export const createCorsGuard = (allowedOrigins: string[]): RequestHandler => {
  const originAllowlist = new Set(allowedOrigins);

  return (request, response, next) => {
    const origin = request.get("origin");

    if (origin && !originAllowlist.has(origin)) {
      const error = createSandboxError(403, "ORIGIN_NOT_ALLOWED", "Origin not allowed.");
      response.status(error.statusCode).json(error.body);
      return;
    }

    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
    }

    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (request.method === "OPTIONS") {
      response.sendStatus(204);
      return;
    }

    next();
  };
};

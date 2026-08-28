import type { RequestHandler } from "express";
import { createSandboxError } from "../security/errorResponses.js";

type RateLimitEntry = {
  requestCount: number;
  windowStartedAt: number;
};

export const createRateLimitGuard = (
  windowMs: number,
  maxRequests: number,
): RequestHandler => {
  const requestsByIp = new Map<string, RateLimitEntry>();

  return (request, response, next) => {
    const now = Date.now();
    const clientIp = request.ip || request.socket.remoteAddress || "unknown";
    const currentEntry = requestsByIp.get(clientIp);

    if (!currentEntry || now - currentEntry.windowStartedAt >= windowMs) {
      requestsByIp.set(clientIp, { requestCount: 1, windowStartedAt: now });
      next();
      return;
    }

    if (currentEntry.requestCount >= maxRequests) {
      response.setHeader(
        "Retry-After",
        Math.ceil((windowMs - (now - currentEntry.windowStartedAt)) / 1_000),
      );
      const error = createSandboxError(
        429,
        "RATE_LIMITED",
        "Too many local sandbox requests. Try again later.",
      );
      response.status(error.statusCode).json(error.body);
      return;
    }

    currentEntry.requestCount += 1;
    next();
  };
};

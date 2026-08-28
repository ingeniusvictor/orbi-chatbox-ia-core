import type { RequestHandler } from "express";

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
      response.status(429).json({
        ok: false,
        mode: "sandbox",
        message: "Too many local sandbox requests. Try again later.",
      });
      return;
    }

    currentEntry.requestCount += 1;
    next();
  };
};

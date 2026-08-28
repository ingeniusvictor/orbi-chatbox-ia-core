import type { RequestHandler } from "express";

export const createAuditLog = (enabled: boolean): RequestHandler => {
  if (!enabled) {
    return (_request, _response, next) => next();
  }

  return (request, response, next) => {
    const startedAt = Date.now();

    response.on("finish", () => {
      console.info("[ORBI receiver audit]", {
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt,
        origin: request.get("origin") ?? "local-tool",
        ip: request.ip || request.socket.remoteAddress || "unknown",
      });
    });

    next();
  };
};

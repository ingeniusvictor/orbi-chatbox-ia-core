import type { RequestHandler } from "express";

export const createCorsGuard = (allowedOrigins: string[]): RequestHandler => {
  const originAllowlist = new Set(allowedOrigins);

  return (request, response, next) => {
    const origin = request.get("origin");

    if (origin && !originAllowlist.has(origin)) {
      response.status(403).json({
        ok: false,
        mode: "sandbox",
        message: "Origin not allowed.",
      });
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

import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "orbi-chatbox-ia-core-receiver",
    mode: "sandbox",
    production: false,
  });
});

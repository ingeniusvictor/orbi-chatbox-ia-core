import express, { type RequestHandler } from "express";

/** Route-only raw parsing preserves Meta signature bytes before global JSON parsing. */
export const createWhatsAppWebhookRawBodyMiddleware = (): RequestHandler => express.raw({ type: "application/json", limit: "64kb" });

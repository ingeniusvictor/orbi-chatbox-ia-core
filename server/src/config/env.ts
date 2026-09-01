import "dotenv/config";
import { resolveConfiguredAiProvider } from "./aiProviderSelection.js";
import { loadPostMvpRuntimeConfig } from "./runtimeConfig.js";
import type { AiProviderMode } from "../types/aiProvider.js";

export type ServerRuntimeEnv = {
  nodeEnv: string;
  port: number;
  allowedOrigins: string[];
  demoWidgetPublicKey: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  auditLogEnabled: boolean;
  activeAiProvider: AiProviderMode;
};

const parsePositiveInteger = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const parseAllowedOrigins = (value: string | undefined): string[] => {
  const configuredOrigins = value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins && configuredOrigins.length > 0
    ? configuredOrigins
    : ["http://localhost:3000", "http://127.0.0.1:3000"];
};

export const loadServerRuntimeEnv = (): ServerRuntimeEnv => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePositiveInteger(process.env.ORBI_SERVER_PORT, 8787),
  allowedOrigins: parseAllowedOrigins(process.env.ORBI_ALLOWED_ORIGINS),
  demoWidgetPublicKey:
    process.env.ORBI_DEMO_WIDGET_PUBLIC_KEY?.trim() || "orbi_demo_widget_key",
  rateLimitWindowMs: parsePositiveInteger(
    process.env.ORBI_WIDGET_RATE_LIMIT_WINDOW_MS,
    60_000,
  ),
  rateLimitMaxRequests: parsePositiveInteger(
    process.env.ORBI_WIDGET_RATE_LIMIT_MAX_REQUESTS,
    30,
  ),
  auditLogEnabled: (process.env.ORBI_AUDIT_LOG_ENABLED ?? "true").toLowerCase() === "true",
  activeAiProvider: loadPostMvpRuntimeConfig().provider,
});

import {
  DEFAULT_LOCAL_AI_TIMEOUT_MS,
  MAX_LOCAL_AI_TIMEOUT_MS,
  validateLocalAiRuntimeConfig,
} from "../src/services/localAiRuntimeConfig.js";
import { evaluateLocalAiRuntimeReadiness } from "../src/services/localAiRuntimeReadiness.js";
import type { LocalAiRuntimeReadiness } from "../src/types/localAiRuntime.js";

const validLocalhost = Object.freeze({
  runtimeId: "synthetic-local-runtime",
  endpoint: "http://localhost:11434",
  model: "synthetic-local-model",
  timeoutMs: DEFAULT_LOCAL_AI_TIMEOUT_MS,
});
const validLoopback = Object.freeze({ ...validLocalhost, endpoint: "http://127.0.0.1:8080" });
const externalHost = Object.freeze({ ...validLocalhost, endpoint: "http://example.invalid:8080" });
const publicHttpsHost = Object.freeze({ ...validLocalhost, endpoint: "https://example.invalid" });
const emptyRuntimeId = Object.freeze({ ...validLocalhost, runtimeId: "" });
const emptyEndpoint = Object.freeze({ ...validLocalhost, endpoint: "" });
const emptyModel = Object.freeze({ ...validLocalhost, model: "" });
const invalidTimeout = Object.freeze({ ...validLocalhost, timeoutMs: 0 });
const excessiveTimeout = Object.freeze({ ...validLocalhost, timeoutMs: MAX_LOCAL_AI_TIMEOUT_MS + 1 });

const main = (): void => {
  const localhostValidation = validateLocalAiRuntimeConfig(validLocalhost);
  const loopbackValidation = validateLocalAiRuntimeConfig(validLoopback);
  const validReadiness = evaluateLocalAiRuntimeReadiness(validLocalhost);
  const invalidReadiness = evaluateLocalAiRuntimeReadiness(externalHost);
  const repeatedReadiness = evaluateLocalAiRuntimeReadiness(validLocalhost);
  const readinessResults: readonly LocalAiRuntimeReadiness[] = [
    validReadiness,
    invalidReadiness,
  ];

  const passed = localhostValidation.ok
    && loopbackValidation.ok
    && !validateLocalAiRuntimeConfig(externalHost).ok
    && !validateLocalAiRuntimeConfig(publicHttpsHost).ok
    && !validateLocalAiRuntimeConfig(emptyRuntimeId).ok
    && !validateLocalAiRuntimeConfig(emptyEndpoint).ok
    && !validateLocalAiRuntimeConfig(emptyModel).ok
    && !validateLocalAiRuntimeConfig(invalidTimeout).ok
    && !validateLocalAiRuntimeConfig(excessiveTimeout).ok
    && Object.isFrozen(localhostValidation.config)
    && validReadiness.state === "unavailable"
    && validReadiness.model === "synthetic-local-model"
    && invalidReadiness.state === "misconfigured"
    && readinessResults.every((result) => result.state !== "ready")
    && Object.isFrozen(validReadiness)
    && Object.isFrozen(invalidReadiness)
    && validReadiness.state === repeatedReadiness.state
    && validReadiness.reason === repeatedReadiness.reason;

  if (!passed) {
    console.error("Local AI Runtime Contract QA: FAIL");
    process.exit(1);
  }

  console.info("Local AI Runtime Contract QA: PASS (configuration-only; no runtime connection)");
};

main();

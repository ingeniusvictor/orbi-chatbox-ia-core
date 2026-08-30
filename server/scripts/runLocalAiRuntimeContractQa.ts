import {
  DEFAULT_LOCAL_AI_TIMEOUT_MS,
  MAX_LOCAL_AI_TIMEOUT_MS,
  validateLocalAiRuntimeConfig,
} from "../src/services/localAiRuntimeConfig.js";
import { evaluateLocalAiRuntimeReadiness } from "../src/services/localAiRuntimeReadiness.js";
import {
  createLocalAiRuntimeProbeRequest,
  createLocalAiRuntimeProbeResult,
  mapProbeResultToReadiness,
  MAX_LOCAL_AI_PROBE_LATENCY_MS,
} from "../src/services/localAiRuntimeProbe.js";
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
  const probeRequest = createLocalAiRuntimeProbeRequest(validLocalhost);
  const reachable = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "reachable", latencyMs: 12, reason: null });
  const unreachable = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "unreachable", latencyMs: null, reason: "runtime-unreachable" });
  const timeout = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "timeout", latencyMs: null, reason: "runtime-timeout" });
  const invalidResponse = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "invalid-response", latencyMs: 4, reason: "invalid-runtime-response" });
  const invalidLatency = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "reachable", latencyMs: -1, reason: null });
  const infiniteLatency = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "reachable", latencyMs: Infinity, reason: null });
  const excessiveLatency = createLocalAiRuntimeProbeResult({ runtimeId: "synthetic-local-runtime", status: "reachable", latencyMs: MAX_LOCAL_AI_PROBE_LATENCY_MS + 1, reason: null });

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

  const probePassed = reachable.ok
    && unreachable.ok
    && timeout.ok
    && invalidResponse.ok
    && mapProbeResultToReadiness(reachable.result).state === "ready"
    && mapProbeResultToReadiness(unreachable.result).state === "unavailable"
    && mapProbeResultToReadiness(timeout.result).state === "unavailable"
    && mapProbeResultToReadiness(invalidResponse.result).state === "unavailable"
    && !invalidLatency.ok
    && !infiniteLatency.ok
    && !excessiveLatency.ok
    && Object.isFrozen(probeRequest)
    && Object.isFrozen(reachable.result);

  if (!passed || !probePassed) {
    console.error("Local AI Runtime Contract QA: FAIL");
    process.exit(1);
  }

  console.info("Local AI Runtime Contract QA: PASS (configuration and synthetic probe only; no runtime connection)");
};

main();

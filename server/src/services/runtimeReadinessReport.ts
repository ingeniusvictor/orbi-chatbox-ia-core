import type { CommercialRuntimeValidationResult } from "./commercialRuntimeValidator.js";

export const RUNTIME_READINESS_COMPONENTS = ["clientProfile", "commercialPolicy", "core", "providerConfiguration", "memory", "tools", "businessTools", "handoff", "telemetry", "channels", "knowledge"] as const;
export type RuntimeReadinessComponent = typeof RUNTIME_READINESS_COMPONENTS[number];
export type RuntimeReadinessStatus = "READY" | "DEGRADED" | "NOT_READY";
export type RuntimeReadinessComponentResult = Readonly<{ component: RuntimeReadinessComponent; status: RuntimeReadinessStatus; safeCode: string; safeMessage: string }>;
export type RuntimeReadinessReport = Readonly<{ status: RuntimeReadinessStatus; components: readonly RuntimeReadinessComponentResult[] }>;

const validatorToReport: Readonly<Record<string, RuntimeReadinessComponent>> = Object.freeze({
  activeClient: "clientProfile",
  commercialPolicy: "commercialPolicy",
  providerConfiguration: "providerConfiguration",
  memory: "memory",
  tools: "tools",
  businessTools: "businessTools",
  handoff: "handoff",
  telemetry: "telemetry",
  channels: "channels",
  knowledge: "knowledge",
});

/** Pure aggregation of already-sanitized structural findings; performs no probes. */
export const createRuntimeReadinessReport = (validation: Readonly<CommercialRuntimeValidationResult>): RuntimeReadinessReport => {
  const byComponent = new Map<RuntimeReadinessComponent, RuntimeReadinessComponentResult>();
  byComponent.set("core", Object.freeze({ component: "core", status: "READY", safeCode: "CORE_READY", safeMessage: "Core composition is available." }));
  for (const item of validation.findings) {
    const component = validatorToReport[item.component];
    if (!component) continue;
    const optionalTelemetry = component === "telemetry" && item.safeCode === "TELEMETRY_OPTIONAL";
    byComponent.set(component, Object.freeze({
      component,
      status: !item.valid ? "NOT_READY" : optionalTelemetry ? "DEGRADED" : "READY",
      safeCode: item.safeCode.slice(0, 80),
      safeMessage: item.safeMessage.slice(0, 160),
    }));
  }
  const components = Object.freeze(RUNTIME_READINESS_COMPONENTS.map((component) =>
    byComponent.get(component) ?? Object.freeze({ component, status: "NOT_READY" as const, safeCode: "COMPONENT_FINDING_MISSING", safeMessage: "Required structural finding is missing." }),
  ));
  const mandatoryFailure = components.some((item) => item.component !== "telemetry" && item.status === "NOT_READY");
  const degraded = components.some((item) => item.status === "DEGRADED");
  return Object.freeze({ status: mandatoryFailure ? "NOT_READY" : degraded ? "DEGRADED" : "READY", components });
};

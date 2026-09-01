/** Provider-neutral, descriptive capability contract. It does not grant execution. */
export type CapabilityCategory = "knowledge" | "conversation" | "system" | "action";
export type CapabilityStatus = "enabled" | "disabled" | "unavailable";
export type CapabilityRisk = "read-only" | "controlled-write" | "restricted";
export type CapabilityExecutionMode = "internal" | "external";

export type CapabilityDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: CapabilityCategory;
  readonly status: CapabilityStatus;
  readonly risk: CapabilityRisk;
  readonly executionMode: CapabilityExecutionMode;
  readonly version: string;
  readonly tags?: readonly string[];
};

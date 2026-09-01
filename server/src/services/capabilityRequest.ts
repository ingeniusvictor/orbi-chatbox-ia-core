import { randomUUID } from "node:crypto";
import { getCapabilityById } from "./capabilityRegistry.js";
import type { CapabilityDefinition } from "../types/capability.js";
import type { CapabilityRequest, CapabilityRequestDecision, CapabilityRequestInput } from "../types/capabilityRequest.js";

export const MAX_CAPABILITY_REQUEST_REASON_CHARACTERS = 300;
export const MAX_CAPABILITY_INPUT_KEYS = 8;
export const MAX_CAPABILITY_INPUT_KEY_CHARACTERS = 64;
export const MAX_CAPABILITY_INPUT_VALUE_CHARACTERS = 1000;

export type CreateCapabilityRequestInput = {
  readonly capabilityId: string;
  readonly reason: string;
  readonly input?: CapabilityRequestInput;
};

const validCapabilityId = (value: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 64;

const normalizeReason = (value: string): string => {
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > MAX_CAPABILITY_REQUEST_REASON_CHARACTERS) throw new Error("Invalid capability request reason.");
  return normalized;
};

const copyInput = (input: CapabilityRequestInput | undefined): CapabilityRequestInput => {
  if (input !== undefined && (typeof input !== "object" || input === null || Array.isArray(input))) throw new Error("Invalid capability request input.");
  const entries = Object.entries(input ?? {});
  if (entries.length > MAX_CAPABILITY_INPUT_KEYS) throw new Error("Too many capability request input fields.");
  if (entries.some(([key, value]) => key.length === 0 || key.length > MAX_CAPABILITY_INPUT_KEY_CHARACTERS || typeof value !== "string" || value.length > MAX_CAPABILITY_INPUT_VALUE_CHARACTERS)) {
    throw new Error("Invalid capability request input.");
  }
  return Object.freeze(Object.fromEntries(entries));
};

/** Creates a short-lived, immutable request. It does not consult or alter runtime execution. */
export const createCapabilityRequest = (input: Readonly<CreateCapabilityRequestInput>): Readonly<CapabilityRequest> => {
  if (!validCapabilityId(input.capabilityId)) throw new Error("Invalid capability request capability ID.");
  return Object.freeze({
    id: randomUUID(),
    capabilityId: input.capabilityId,
    reason: normalizeReason(input.reason),
    input: copyInput(input.input),
    status: "requested",
  });
};

/** Defense-in-depth eligibility check. Any non-read-only, external, or non-enabled descriptor is blocked. */
export const evaluateCapabilityEligibility = (capability: Readonly<CapabilityDefinition> | undefined): "allowed" | "blocked" | "unavailable" => {
  if (!capability) return "blocked";
  if (capability.status === "unavailable") return "unavailable";
  if (capability.status !== "enabled" || capability.risk !== "read-only" || capability.executionMode !== "internal") return "blocked";
  return "allowed";
};

/** Consults the static registry and returns a descriptive decision; no capability service is called. */
export const evaluateCapabilityRequest = (request: Readonly<CapabilityRequest>): Readonly<CapabilityRequestDecision> => {
  const capability = getCapabilityById(request.capabilityId);
  const decision = evaluateCapabilityEligibility(capability);
  const reason = decision === "allowed"
    ? "Capability is eligible for future controlled execution."
    : decision === "unavailable"
      ? "Capability is known but unavailable."
      : "Capability is not eligible for execution.";
  return Object.freeze({ requestId: request.id, capabilityId: request.capabilityId, decision, reason });
};

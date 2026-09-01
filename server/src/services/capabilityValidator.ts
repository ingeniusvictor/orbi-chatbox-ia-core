import type { CapabilityCategory, CapabilityDefinition, CapabilityExecutionMode, CapabilityRisk, CapabilityStatus } from "../types/capability.js";

const categories: readonly CapabilityCategory[] = ["knowledge", "conversation", "system", "action"];
const statuses: readonly CapabilityStatus[] = ["enabled", "disabled", "unavailable"];
const risks: readonly CapabilityRisk[] = ["read-only", "controlled-write", "restricted"];
const executionModes: readonly CapabilityExecutionMode[] = ["internal", "external"];
const MAX_ID_LENGTH = 64;
const MAX_NAME_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 600;
const MAX_VERSION_LENGTH = 64;
const MAX_TAGS = 12;
const MAX_TAG_LENGTH = 48;

export type CapabilityValidation = { readonly ok: true } | { readonly ok: false; readonly message: string };

const invalid = (message: string): CapabilityValidation => ({ ok: false, message });

/** Pure contract validation. Enabled capabilities are limited to internal read-only descriptors. */
export const validateCapability = (capability: Readonly<CapabilityDefinition>): CapabilityValidation => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(capability.id) || capability.id.length > MAX_ID_LENGTH) return invalid("Invalid capability ID.");
  if (capability.name.trim().length === 0 || capability.name.length > MAX_NAME_LENGTH) return invalid("Invalid capability name.");
  if (capability.description.trim().length === 0 || capability.description.length > MAX_DESCRIPTION_LENGTH) return invalid("Invalid capability description.");
  if (!categories.includes(capability.category)) return invalid("Invalid capability category.");
  if (!statuses.includes(capability.status)) return invalid("Invalid capability status.");
  if (!risks.includes(capability.risk)) return invalid("Invalid capability risk.");
  if (!executionModes.includes(capability.executionMode)) return invalid("Invalid capability execution mode.");
  if (capability.version.trim().length === 0 || capability.version.length > MAX_VERSION_LENGTH) return invalid("Invalid capability version.");
  if (capability.tags && (capability.tags.length > MAX_TAGS || capability.tags.some((tag) => tag.trim().length === 0 || tag.length > MAX_TAG_LENGTH) || new Set(capability.tags).size !== capability.tags.length)) return invalid("Invalid capability tags.");
  if (capability.status === "enabled" && (capability.risk !== "read-only" || capability.executionMode !== "internal")) return invalid("Only internal read-only capabilities may be enabled.");
  return { ok: true };
};

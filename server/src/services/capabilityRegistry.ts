import { ORBI_CAPABILITIES } from "../data/orbiCapabilities.js";
import type { CapabilityDefinition } from "../types/capability.js";
import { validateCapability } from "./capabilityValidator.js";

const copyCapability = (capability: Readonly<CapabilityDefinition>): Readonly<CapabilityDefinition> => Object.freeze({
  ...capability,
  ...(capability.tags ? { tags: Object.freeze([...capability.tags]) } : {}),
});

for (const capability of ORBI_CAPABILITIES) {
  const validation = validateCapability(capability);
  if (validation.ok === false) throw new Error(`Invalid registered capability: ${validation.message}`);
}
if (new Set(ORBI_CAPABILITIES.map((capability) => capability.id)).size !== ORBI_CAPABILITIES.length) {
  throw new Error("Registered capability IDs must be unique.");
}

/** Read-only registry APIs only. This module intentionally has no execution surface. */
export const getCapabilities = (): readonly Readonly<CapabilityDefinition>[] => Object.freeze(ORBI_CAPABILITIES.map(copyCapability));
export const getCapabilityById = (id: string): Readonly<CapabilityDefinition> | undefined => {
  const capability = ORBI_CAPABILITIES.find((candidate) => candidate.id === id);
  return capability ? copyCapability(capability) : undefined;
};
export const getEnabledCapabilities = (): readonly Readonly<CapabilityDefinition>[] => Object.freeze(
  ORBI_CAPABILITIES.filter((capability) => capability.status === "enabled").map(copyCapability),
);
export const isCapabilityEnabled = (id: string): boolean => getCapabilityById(id)?.status === "enabled";

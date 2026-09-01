import type { CapabilityDefinition } from "../types/capability.js";

const freezeCapability = (capability: CapabilityDefinition): Readonly<CapabilityDefinition> => Object.freeze({
  ...capability,
  ...(capability.tags ? { tags: Object.freeze([...capability.tags]) } : {}),
});

/** Static capability descriptors. They document controlled availability only; none execute here. */
export const ORBI_CAPABILITIES: readonly Readonly<CapabilityDefinition>[] = Object.freeze([
  freezeCapability({ id: "knowledge-search", name: "Knowledge Search", description: "Controlled internal read-only access to approved local knowledge.", category: "knowledge", status: "enabled", risk: "read-only", executionMode: "internal", version: "1", tags: ["local", "read-only"] }),
  freezeCapability({ id: "conversation-context", name: "Conversation Context", description: "Controlled internal read-only access to bounded ephemeral conversation context.", category: "conversation", status: "enabled", risk: "read-only", executionMode: "internal", version: "1", tags: ["ephemeral", "read-only"] }),
  freezeCapability({ id: "system-status", name: "System Status", description: "Known internal system status surface without a runtime implementation.", category: "system", status: "unavailable", risk: "read-only", executionMode: "internal", version: "1" }),
  freezeCapability({ id: "external-action", name: "External Action", description: "Future external action boundary; intentionally disabled and non-executable.", category: "action", status: "disabled", risk: "restricted", executionMode: "external", version: "1" }),
]);

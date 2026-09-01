import { ORBI_CAPABILITIES } from "../src/data/orbiCapabilities.js";
import * as capabilityRegistry from "../src/services/capabilityRegistry.js";
import { validateCapability } from "../src/services/capabilityValidator.js";
import type { CapabilityDefinition } from "../src/types/capability.js";

const main = (): void => {
  const capabilities = capabilityRegistry.getCapabilities();
  const repeated = capabilityRegistry.getCapabilities();
  const ids = capabilities.map((capability) => capability.id);
  const enabled = capabilityRegistry.getEnabledCapabilities();
  const restrictedEnabled = validateCapability(Object.freeze({ ...capabilities[3]!, status: "enabled" }) as Readonly<CapabilityDefinition>);
  const controlledWriteEnabled = validateCapability(Object.freeze({ ...capabilities[0]!, risk: "controlled-write" }) as Readonly<CapabilityDefinition>);
  const invalidId = validateCapability(Object.freeze({ ...capabilities[0]!, id: "Invalid Capability" }) as Readonly<CapabilityDefinition>);
  const registryKeys = Object.keys(capabilityRegistry);
  const passed = ORBI_CAPABILITIES.length === 4
    && ids.join(",") === "knowledge-search,conversation-context,system-status,external-action"
    && new Set(ids).size === capabilities.length
    && capabilities.every((capability) => validateCapability(capability).ok)
    && capabilities.every((capability) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(capability.id) && capability.name.length > 0 && capability.description.length > 0 && capability.version.length > 0)
    && capabilities.every((capability) => ["knowledge", "conversation", "system", "action"].includes(capability.category) && ["enabled", "disabled", "unavailable"].includes(capability.status) && ["read-only", "controlled-write", "restricted"].includes(capability.risk) && ["internal", "external"].includes(capability.executionMode))
    && capabilityRegistry.getCapabilityById("knowledge-search")?.status === "enabled"
    && capabilityRegistry.getCapabilityById("conversation-context")?.status === "enabled"
    && capabilityRegistry.getCapabilityById("system-status")?.status === "unavailable"
    && capabilityRegistry.getCapabilityById("external-action")?.status === "disabled"
    && capabilityRegistry.getCapabilityById("unknown-capability") === undefined
    && capabilityRegistry.isCapabilityEnabled("knowledge-search")
    && !capabilityRegistry.isCapabilityEnabled("external-action")
    && !capabilityRegistry.isCapabilityEnabled("unknown-capability")
    && enabled.map((capability) => capability.id).join(",") === "knowledge-search,conversation-context"
    && JSON.stringify(capabilities) === JSON.stringify(repeated)
    && capabilities[0] !== repeated[0] && Object.isFrozen(capabilities) && Object.isFrozen(capabilities[0]) && Object.isFrozen(capabilities[0]?.tags)
    && restrictedEnabled.ok === false && controlledWriteEnabled.ok === false && invalidId.ok === false
    && !registryKeys.some((key) => /execute|invoke|tool|dispatch/i.test(key));
  if (!passed) { console.error("Capability Contract QA: FAIL"); process.exit(1); }
  console.info("Capability Contract QA: PASS (registry descriptors only; no capability execution or external calls)");
};

main();

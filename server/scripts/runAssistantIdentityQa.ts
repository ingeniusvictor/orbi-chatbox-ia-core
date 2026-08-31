import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { getAssistantIdentity, getAssistantIdentityName } from "../src/services/assistantIdentity.js";

const forbidden = ["qwen", "ollama", "gemma", "openai", "gemini", "model", "endpoint", "temperature", "token"];
const main = (): void => {
  const first = getAssistantIdentity(); const repeated = getAssistantIdentity();
  const serialized = JSON.stringify(first).toLowerCase();
  const traits = ["intelligent", "approachable", "curious", "patient", "solution-oriented", "educational", "responsible", "optimistic"];
  const passed = first === LUMI_IDENTITY
    && first === repeated
    && first.id === "lumi"
    && first.name === "LUMI"
    && getAssistantIdentityName() === "LUMI"
    && first.designation === "ORBI Intelligent Companion"
    && first.organization === "ORBI Ecosystem"
    && first.mission.length > 0 && first.corePrinciple.length > 0
    && traits.every((trait) => first.personalityTraits.includes(trait as never))
    && first.tonePrinciples.length > 0 && first.behaviorPrinciples.length > 0
    && first.personalityTraits.length <= 10 && first.tonePrinciples.length <= 10 && first.behaviorPrinciples.length <= 10
    && Object.isFrozen(first) && Object.isFrozen(first.personalityTraits) && Object.isFrozen(first.tonePrinciples) && Object.isFrozen(first.behaviorPrinciples)
    && forbidden.every((value) => !serialized.includes(value));
  if (!passed) { console.error("Assistant Identity QA: FAIL"); process.exit(1); }
  console.info("Assistant Identity QA: PASS (immutable, provider-independent LUMI contract only)");
};
main();

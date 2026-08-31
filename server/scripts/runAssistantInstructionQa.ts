import { LUMI_IDENTITY } from "../src/data/lumiIdentity.js";
import { MAX_ASSISTANT_INSTRUCTION_CHARACTERS, composeAssistantInstruction } from "../src/services/assistantInstructionComposer.js";

const forbidden = ["qwen", "ollama", "gemma", "openai", "gemini"];
const main = (): void => {
  const first = composeAssistantInstruction(LUMI_IDENTITY); const repeated = composeAssistantInstruction(LUMI_IDENTITY);
  const required = ["LUMI", "ORBI Intelligent Companion", "ORBI Ecosystem", "Transform ORBI knowledge", "Do not only answer", "intelligent", "clear", "help before impressing", "Do not claim to be human", "Do not pretend certainty", "Do not invent ORBI-specific facts", "Prefer clear next steps"];
  const passed = first.assistantId === "lumi" && first.assistantName === "LUMI" && first.version === "1"
    && first.characterCount === first.text.length && first.characterCount <= MAX_ASSISTANT_INSTRUCTION_CHARACTERS
    && required.every((value) => first.text.includes(value)) && forbidden.every((value) => !first.text.toLowerCase().includes(value))
    && first.text === repeated.text && Object.isFrozen(first);
  if (!passed) { console.error("Assistant Instruction QA: FAIL"); process.exit(1); }
  console.info("Assistant Instruction QA: PASS (deterministic, bounded, provider-neutral composition only)");
};
main();

import { readFile } from "node:fs/promises";
import { LUMI_BEHAVIOR_POLICY } from "../src/data/lumiBehaviorPolicy.js";
import { LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG } from "../src/config/localTextToSpeech.js";
import { composeAssistantBehaviorInstruction } from "../src/services/assistantBehaviorPolicyComposer.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

try {
  const behavior = composeAssistantBehaviorInstruction(LUMI_BEHAVIOR_POLICY);
  const [voiceRoute, sttSource] = await Promise.all([
    readFile(new URL("../src/routes/voice.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/services/localSpeechToTextProvider.ts", import.meta.url), "utf8"),
  ]);
  assert(behavior.text.includes("without echoing wording") && behavior.text.includes("Briefly acknowledge greetings or checks"), "Greeting acknowledgement must remain concise and non-repetitive.");
  assert(LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG.runtimeId === "windows-sapi-local" && LOCAL_TEXT_TO_SPEECH_RUNTIME_CONFIG.format === "wav", "Local SAPI WAV fallback must remain available.");
  assert(!voiceRoute.match(/whatsapp|openai|gemini|https?:\/\//i) && !sttSource.match(/openai|gemini|https?:\/\//i), "Voice runtime must remain local-only.");
  assert(voiceRoute.includes("convertVoiceAudioToWav") && voiceRoute.includes("createTextToSpeechProvider"), "Existing voice routes and Core handoff must remain in use.");
  console.info("Voice Quality QA: PASS (compact acknowledgement policy; local SAPI WAV retained; no cloud runtime)");
} catch (error) { console.error(error); process.exit(1); }

import { readFileSync } from "node:fs";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

try {
  const chat = read("../../src/components/workspaces/ChatStudioWorkspace.tsx");
  const rail = read("../../src/components/chat/LumiPresenceRail.tsx");
  const identity = read("../../src/components/chat/LumiVisualIdentity.tsx");
  const diagnostics = read("../../src/components/chat/ChatDiagnosticsDrawer.tsx");
  const message = read("../../src/components/chat/LumiMessageCard.tsx");
  const userMessage = read("../../src/components/chat/UserMessageCard.tsx");
  const suggestions = read("../../src/components/chat/LumiSuggestionGrid.tsx");
  const composer = read("../../src/components/chat/LumiVoiceComposer.tsx");
  assert(chat.includes("LumiPresenceRail") && rail.includes("LumiVisualIdentity") && identity.includes("ORBI Intelligent") && rail.includes("lg:flex"), "Desktop LUMI presence rail is required.");
  assert(chat.includes("ChatDiagnosticsDrawer") && chat.includes("diagnosticsOpen") && diagnostics.includes("pointer-events-none"), "Diagnostics must be available on demand outside the primary chat layout.");
  assert(chat.includes("min-w-0 flex-1") && chat.includes("h-[680px]") && !chat.includes("lg:grid-cols-3"), "The conversation must dominate the available desktop width.");
  assert(chat.includes("LumiSuggestionGrid") && suggestions.includes("grid grid-cols-2") && !suggestions.includes("overflow-x-auto"), "Suggestions must respond rather than clip horizontally.");
  assert(chat.includes("LumiVoiceComposer") && composer.includes("stateCopy") && message.includes("VoiceWaveformPlayer") && userMessage.includes("Mensaje por voz"), "Premium voice and message state treatments are required.");
  assert(!chat.includes("localStorage") && !chat.includes("sessionStorage") && !rail.includes("whatsapp") && !diagnostics.includes("whatsapp"), "The premium UI must not add persistence or a messaging channel.");
  console.info("Frontend Premium Chat QA: PASS");
} catch (error) { console.error(error); process.exit(1); }

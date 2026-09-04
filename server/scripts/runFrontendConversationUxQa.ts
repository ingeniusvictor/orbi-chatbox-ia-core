import { readFileSync } from "node:fs";
import { isSendableChatMessage } from "../../src/services/chatRuntimeState.ts";
const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const main = (): void => {
  const source = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const welcome = readFileSync(new URL("../../src/components/chat/LumiWelcomeState.tsx", import.meta.url), "utf8");
  const lumiMessage = readFileSync(new URL("../../src/components/chat/LumiMessageCard.tsx", import.meta.url), "utf8");
  const userMessage = readFileSync(new URL("../../src/components/chat/UserMessageCard.tsx", import.meta.url), "utf8");
  const composer = readFileSync(new URL("../../src/components/chat/LumiVoiceComposer.tsx", import.meta.url), "utf8");
  const passed = !isSendableChatMessage("") && !isSendableChatMessage("  ") && isSendableChatMessage("Hola")
    && source.includes("LumiWelcomeState") && welcome.includes("Hola, soy") && lumiMessage.includes(">LUMI</span>") && source.includes("UserMessageCard") && userMessage.includes("message.text")
    && composer.includes("event.key === \"Enter\" && !event.shiftKey") && composer.includes("disabled={!value.trim() || disabled}")
    && source.includes('getLumiRuntimeStateMessage("processing")') && source.includes("role=\"alert\"") && source.includes("Reintentar")
    && lumiMessage.includes("message.backend?.grounded") && lumiMessage.includes("Con conocimiento ORBI")
    && !source.includes("localStorage") && !composer.includes("localStorage") && !source.includes("sourceEntryIds.join") && !source.includes("conversationId}</");
  assert(passed, "Frontend Conversation UX QA: FAIL");
  console.info("Frontend Conversation UX QA: PASS (clear roles, controlled pending/error/retry, runtime-only conversation metadata)");
};
try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Frontend Conversation UX QA failed."); process.exit(1); }

import { readFileSync } from "node:fs";
import { isSendableChatMessage } from "../../src/services/chatRuntimeState.ts";
const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const main = (): void => {
  const source = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const passed = !isSendableChatMessage("") && !isSendableChatMessage("  ") && isSendableChatMessage("Hola")
    && source.includes("LUMI está lista para conversar") && source.includes(">LUMI</span>")
    && source.includes("e.key === \"Enter\" && !e.shiftKey") && source.includes("disabled={!inputText.trim() || isTyping}")
    && source.includes('getLumiRuntimeStateMessage("processing")') && source.includes("role=\"alert\"") && source.includes("Reintentar")
    && source.includes("msg.backend.provider") && source.includes("Con conocimiento ORBI")
    && !source.includes("localStorage") && !source.includes("sourceEntryIds.join") && !source.includes("conversationId}</");
  assert(passed, "Frontend Conversation UX QA: FAIL");
  console.info("Frontend Conversation UX QA: PASS (clear roles, controlled pending/error/retry, runtime-only conversation metadata)");
};
try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Frontend Conversation UX QA failed."); process.exit(1); }

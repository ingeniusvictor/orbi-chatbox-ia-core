import { readFileSync } from "node:fs";
import { appendRuntimeMessage, createBackendAssistantMessage, isSendableChatMessage } from "../../src/services/chatRuntimeState.ts";
import type { ChatBackendSuccessResponse } from "../../src/types/chatBackend.ts";

const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };

const main = (): void => {
  const response: ChatBackendSuccessResponse = Object.freeze({ ok: true, message: "Respuesta controlada.", conversationId: "runtime-conversation", provider: "mock", grounded: true, sourceEntryIds: Object.freeze(["core-assistant-overview"]) });
  const user = { id: "user-1", sender: "user" as const, text: "Hola", timestamp: "10:00" };
  const assistant = createBackendAssistantMessage("assistant-1", "10:01", response);
  const first = appendRuntimeMessage([], user);
  const second = appendRuntimeMessage(first, assistant);
  const source = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const composerSource = readFileSync(new URL("../../src/components/chat/LumiVoiceComposer.tsx", import.meta.url), "utf8");
  const passed = !isSendableChatMessage("   ") && isSendableChatMessage("Hola")
    && first.length === 1 && second.length === 2 && first !== second
    && assistant.text === response.message && assistant.backend?.provider === "mock" && assistant.backend?.grounded === true && assistant.backend?.sourceEntryIds.join(",") === "core-assistant-overview"
    && source.includes("conversationId,") && source.includes("setConversationId(result.body.conversationId)")
    && source.includes("classifyLumiRuntimeState(result)") && composerSource.includes("disabled={!value.trim() || disabled}")
    && !source.includes("localStorage") && !source.includes("Provider selector") && !source.includes("generateAssistantReply(result");
  assert(passed, "Frontend Chat Runtime Contract QA: FAIL");
  console.info("Frontend Chat Runtime Contract QA: PASS (runtime conversation state, metadata, controlled errors, no frontend fallback or persistence)");
};

try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Frontend Chat Runtime Contract QA failed."); process.exit(1); }

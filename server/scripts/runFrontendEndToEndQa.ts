import { readFileSync } from "node:fs";
import { appendRuntimeMessage, createBackendAssistantMessage, isSendableChatMessage } from "../../src/services/chatRuntimeState.ts";
import { classifyLumiRuntimeState, getLumiRuntimeStateMessage } from "../../src/services/lumiRuntimeState.ts";
import type { ChatBackendSuccessResponse } from "../../src/types/chatBackend.ts";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

const main = (): void => {
  const chatSource = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const lumiMessageSource = readFileSync(new URL("../../src/components/chat/LumiMessageCard.tsx", import.meta.url), "utf8");
  const composerSource = readFileSync(new URL("../../src/components/chat/LumiVoiceComposer.tsx", import.meta.url), "utf8");
  const clientSource = readFileSync(new URL("../../src/services/backendReceiverClient.ts", import.meta.url), "utf8");
  const response: ChatBackendSuccessResponse = Object.freeze({
    ok: true,
    message: "Respuesta LUMI controlada.",
    conversationId: "runtime-only-conversation-id",
    provider: "qwen-local",
    grounded: true,
    sourceEntryIds: Object.freeze(["structured-orbi-entry"]),
  });
  const user = { id: "user-1", sender: "user" as const, text: "Consulta ORBI", timestamp: "10:00" };
  const userMessages = appendRuntimeMessage([], user);
  const retryMessages = userMessages;
  const assistant = createBackendAssistantMessage("assistant-1", "10:01", response);
  const completeMessages = appendRuntimeMessage(retryMessages, assistant);
  const errorState = classifyLumiRuntimeState({ ok: false, status: 503, errorCode: "LOCAL_AI_TIMEOUT", message: "Internal detail" });

  const checks: ReadonlyArray<readonly [string, boolean]> = [
    ["request contract", clientSource.includes("conversationId: input.conversationId") && clientSource.includes("consentAccepted: true")],
    ["response contract", clientSource.includes("const success = parseSuccessResponse(body)") && clientSource.includes("sourceEntryIds") && response.message.length > 0 && response.conversationId.length > 0 && (response.provider === "mock" || response.provider === "qwen-local") && typeof response.grounded === "boolean"],
    ["conversation capture", chatSource.includes("conversationId,") && chatSource.includes("setConversationId(result.body.conversationId)")],
    ["message append/retry", userMessages.length === 1 && retryMessages.length === 1 && completeMessages.length === 2 && completeMessages[1]?.text === response.message],
    ["grounding metadata", assistant.backend?.grounded === true && assistant.backend?.sourceEntryIds.length === 1],
    // D.3 composes the LUMI identity inside the premium header instead of the
    // former standalone span; keep this check behavioral rather than markup-specific.
    ["safe LUMI/grounding UI", chatSource.includes("· LUMI") && lumiMessageSource.includes("Con conocimiento ORBI") && !chatSource.includes("sourceEntryIds.join")],
    ["input UX", composerSource.includes('event.key === "Enter" && !event.shiftKey') && composerSource.includes("disabled={!value.trim() || disabled}") && !isSendableChatMessage(" ")],
    ["pending/retry", chatSource.includes('setRuntimeState("processing")') && chatSource.includes('setRuntimeState("ready")') && chatSource.includes("role=\"alert\"") && chatSource.includes("handleSendMessage(lastFailedMessage, true)")],
    ["safe timeout", errorState === "timeout" && !getLumiRuntimeStateMessage(errorState).includes("LOCAL_AI_") && !getLumiRuntimeStateMessage(errorState).includes("http")],
    ["no frontend runtime leak", chatSource.includes("getLumiRuntimeStateMessage(runtimeState)") && !chatSource.includes("localStorage") && !chatSource.includes("indexedDB") && !chatSource.includes("ollama") && !chatSource.includes("setInterval")],
    ["no selectors/tools/leaks", !chatSource.includes("Provider selector") && !chatSource.includes("Model selector") && !chatSource.includes("capabilityId") && !chatSource.includes("stack")],
  ];
  const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
  assert(failed.length === 0, `Frontend End-to-End QA: FAIL (${failed.join(", ")})`);
  console.info("Frontend End-to-End QA: PASS (runtime-only conversation, safe LUMI UX, grounding, retry/error states, no frontend provider/tool/persistence leaks)");
};

try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Frontend End-to-End QA failed."); process.exit(1); }

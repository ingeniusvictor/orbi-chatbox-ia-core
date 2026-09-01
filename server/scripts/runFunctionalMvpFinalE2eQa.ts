import { readFileSync } from "node:fs";
import { QWEN_LOCAL_RUNTIME_CONFIG } from "../src/config/qwenLocal.js";
import { getCapabilities } from "../src/services/capabilityRegistry.js";
import { buildKnowledgeContext } from "../src/services/knowledgeContextBuilder.js";
import { createControlledKnowledgeSearchRequest } from "../src/services/capabilityInvocationPolicy.js";
import { classifyLumiRuntimeState } from "../../src/services/lumiRuntimeState.ts";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const main = (): void => {
  const chat = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const client = readFileSync(new URL("../../src/services/backendReceiverClient.ts", import.meta.url), "utf8");
  const structured = buildKnowledgeContext("ORBI Academy");
  const legacy = buildKnowledgeContext("sandbox assistant");
  const unsupported = buildKnowledgeContext("política de precios 2027 de O.R.B.I.");
  const checks = [
    QWEN_LOCAL_RUNTIME_CONFIG.model === "qwen3:1.7b" && QWEN_LOCAL_RUNTIME_CONFIG.timeoutMs === 30_000,
    structured.entries.length > 0 && legacy.entries.some((entry) => entry.id === "orbi-sandbox-assistant") && unsupported.entries.length === 0,
    createControlledKnowledgeSearchRequest("Busca información en ORBI sobre Services.") !== undefined && createControlledKnowledgeSearchRequest("Busca restaurantes cerca de mí.") === undefined,
    getCapabilities().filter((entry) => entry.status === "enabled" && entry.id === "knowledge-search").length === 1,
    classifyLumiRuntimeState({ ok: false, status: null, message: "x" }) === "backend-unavailable" && classifyLumiRuntimeState({ ok: false, status: 503, errorCode: "LOCAL_AI_TIMEOUT", message: "x" }) === "timeout",
    client.includes("conversationId: input.conversationId") && !client.includes("ollama"),
    chat.includes("setConversationId(result.body.conversationId)") && chat.includes("handleSendMessage(lastFailedMessage, true)") && chat.includes("Con conocimiento ORBI") && !chat.includes("localStorage") && !chat.includes("sourceEntryIds.join"),
  ];
  assert(checks.every(Boolean), "Functional MVP Final E2E QA: FAIL");
  console.info("Functional MVP Final E2E QA: PASS (contract, knowledge, capability, runtime error and frontend boundaries verified)");
};
try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Functional MVP Final E2E QA failed."); process.exit(1); }

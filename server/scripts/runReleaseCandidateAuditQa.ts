import { readFileSync } from "node:fs";
import { DEFAULT_AI_PROVIDER, resolveConfiguredAiProvider } from "../src/config/aiProviderSelection.js";
import { QWEN_LOCAL_RUNTIME_CONFIG } from "../src/config/qwenLocal.js";
import { REGISTERED_AI_PROVIDER_MODES } from "../src/providers/aiProviderRegistry.js";
import { getAssistantIdentity } from "../src/services/assistantIdentity.js";
import { MAX_ASSISTANT_HISTORY_CHARACTERS, MAX_ASSISTANT_HISTORY_TURNS } from "../src/services/assistantConversationHistoryBuilder.js";
import { MAX_CONVERSATION_HISTORY_CHARACTERS, MAX_CONVERSATION_HISTORY_TURNS } from "../src/services/ephemeralConversationHistory.js";
import { MAX_CONTEXT_CHARACTERS, MAX_CONTEXT_ENTRIES } from "../src/services/knowledgeContextBuilder.js";
import { getCapabilities } from "../src/services/capabilityRegistry.js";
import { validateLocalAiRuntimeConfig } from "../src/services/localAiRuntimeConfig.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

const main = (): void => {
  const chat = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const client = readFileSync(new URL("../../src/services/backendReceiverClient.ts", import.meta.url), "utf8");
  const widget = readFileSync(new URL("../src/routes/widgetMessage.ts", import.meta.url), "utf8");
  const executable = getCapabilities().filter((capability) => capability.status === "enabled" && capability.id === "knowledge-search");
  const checks = [
    QWEN_LOCAL_RUNTIME_CONFIG.model === "qwen3:1.7b" && QWEN_LOCAL_RUNTIME_CONFIG.timeoutMs === 30_000,
    DEFAULT_AI_PROVIDER === "mock" && resolveConfiguredAiProvider(undefined) === "mock" && REGISTERED_AI_PROVIDER_MODES.join(",") === "mock,qwen-local",
    getAssistantIdentity().name === "LUMI",
    MAX_CONTEXT_ENTRIES === 3 && MAX_CONTEXT_CHARACTERS === 1_200,
    MAX_CONVERSATION_HISTORY_TURNS === 8 && MAX_CONVERSATION_HISTORY_CHARACTERS === 6_000 && MAX_ASSISTANT_HISTORY_TURNS === 6 && MAX_ASSISTANT_HISTORY_CHARACTERS === 2_500,
    executable.length === 1 && getCapabilities().find((capability) => capability.id === "external-action")?.status === "disabled",
    validateLocalAiRuntimeConfig({ ...QWEN_LOCAL_RUNTIME_CONFIG, endpoint: "http://192.168.1.8:11434" }).ok === false,
    client.includes("conversationId: input.conversationId") && !client.includes("localStorage") && !client.includes("ollama"),
    !chat.includes("localStorage") && !chat.includes("indexedDB") && !chat.includes("Provider selector") && !chat.includes("Model selector") && !chat.includes("sourceEntryIds.join"),
    widget.includes("createControlledKnowledgeSearchRequest") && !widget.includes("fetch("),
  ];
  assert(checks.every(Boolean), "Release Candidate Audit QA: FAIL");
  console.info("Release Candidate Audit QA: PASS (frozen MVP scope, local-only runtime, bounded knowledge/conversation, safe frontend/backend contract)");
};
try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Release Candidate Audit QA failed."); process.exit(1); }

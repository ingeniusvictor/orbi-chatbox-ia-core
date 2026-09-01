import { readFileSync } from "node:fs";
import { classifyLumiRuntimeState, getLumiRuntimeStateMessage } from "../../src/services/lumiRuntimeState.ts";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

const failure = (status: number | null, errorCode?: string) => ({ ok: false as const, status, errorCode, message: "Internal detail must not be displayed." });

const main = (): void => {
  const source = readFileSync(new URL("../../src/components/workspaces/ChatStudioWorkspace.tsx", import.meta.url), "utf8");
  const checks = [
    classifyLumiRuntimeState(failure(null)) === "backend-unavailable",
    classifyLumiRuntimeState(failure(503, "LOCAL_AI_RUNTIME_UNAVAILABLE")) === "local-ai-unavailable",
    classifyLumiRuntimeState(failure(503, "LOCAL_AI_MODEL_UNAVAILABLE")) === "local-ai-unavailable",
    classifyLumiRuntimeState(failure(503, "LOCAL_AI_TIMEOUT")) === "timeout",
    classifyLumiRuntimeState(failure(502, "LOCAL_AI_INVALID_RESPONSE")) === "error",
    classifyLumiRuntimeState(failure(503, "LOCAL_AI_GENERATION_FAILED")) === "error",
    getLumiRuntimeStateMessage("error").includes("LUMI") && !getLumiRuntimeStateMessage("error").includes("LOCAL_AI_"),
    source.includes('setRuntimeState("processing")') && source.includes('setRuntimeState("ready")'),
    source.includes("classifyLumiRuntimeState(result)") && source.includes("handleSendMessage(lastFailedMessage, true)"),
    source.includes("getLumiRuntimeStateMessage(runtimeState)") && source.includes("getLumiRuntimeStateLabel(runtimeState)"),
    !source.includes("backendError") && !source.includes("ollama") && !source.includes("localStorage") && !source.includes("setInterval") && !source.includes("fallback"),
  ];
  assert(checks.every(Boolean), "Frontend LUMI Runtime State QA: FAIL");
  console.info("Frontend LUMI Runtime State QA: PASS (safe runtime classification, recovery, retry, no direct local-AI access/polling/fallback/persistence)");
};

try { main(); } catch (error) { console.error(error instanceof Error ? error.message : "Frontend LUMI Runtime State QA failed."); process.exit(1); }

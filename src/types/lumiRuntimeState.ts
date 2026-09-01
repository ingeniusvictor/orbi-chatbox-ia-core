/** Small, provider-neutral UI state derived from a real receiver outcome. */
export type LumiRuntimeState =
  | "ready"
  | "processing"
  | "backend-unavailable"
  | "local-ai-unavailable"
  | "timeout"
  | "error";

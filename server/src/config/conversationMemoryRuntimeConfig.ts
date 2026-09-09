import { resolve } from "node:path";
import { FileConversationMemoryStore, InMemoryConversationStore, type ConversationMemoryStore } from "../memory/conversationMemory.js";
export type ConversationMemoryRuntimeConfig = Readonly<{ mode: "memory" | "file"; file: string }>;
export const loadConversationMemoryRuntimeConfig = (env: Readonly<Record<string, string | undefined>> = process.env): ConversationMemoryRuntimeConfig => {
  const mode = env.ORBI_CONVERSATION_MEMORY_MODE?.trim() || "memory";
  if (mode !== "memory" && mode !== "file") throw new Error("Invalid conversation memory mode.");
  return Object.freeze({ mode, file: resolve(env.ORBI_CONVERSATION_MEMORY_FILE?.trim() || ".orbi-data/conversations.json") });
};
export const createConversationMemoryStore = (config = loadConversationMemoryRuntimeConfig()): ConversationMemoryStore => config.mode === "file" ? new FileConversationMemoryStore(config.file) : new InMemoryConversationStore();

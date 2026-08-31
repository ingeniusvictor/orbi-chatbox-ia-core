import type { KnowledgeContext } from "./knowledge.js";
import type { AssistantInstruction } from "./assistantInstruction.js";
import type { AssistantRuntimeInstruction } from "./assistantRuntimeInstruction.js";
import type { AssistantBehaviorInstruction } from "./assistantBehaviorPolicy.js";
import type { AssistantConversationHistory } from "./assistantConversationHistory.js";

/** Architecturally recognized provider identifiers. Only enabled modes are executable. */
export type AiProviderId = "mock" | "qwen-local" | "gemma-local" | "openai" | "gemini";

export type AiProviderDeployment = "development" | "local" | "cloud";

/** Executable modes are deliberately narrower than supported provider identifiers. */
export type AiProviderMode = "mock" | "qwen-local";

export type AiProviderRequest = {
  readonly requestId: string;
  readonly conversationId: string;
  readonly message: string;
  /** Optional only for legacy provider test fixtures; runtime requests always provide it. */
  readonly conversationHistory?: Readonly<AssistantConversationHistory>;
  readonly knowledgeContext: Readonly<KnowledgeContext>;
  readonly assistantInstruction: Readonly<AssistantInstruction>;
  readonly assistantRuntimeInstruction: Readonly<AssistantRuntimeInstruction>;
  readonly assistantBehaviorInstruction: Readonly<AssistantBehaviorInstruction>;
};

export type AiProviderResponse = {
  readonly text: string;
  readonly provider: AiProviderMode;
  readonly grounded: boolean;
  readonly sourceEntryIds: readonly string[];
};

export interface AiProvider {
  readonly mode: AiProviderMode;
  generate(request: Readonly<AiProviderRequest>): Promise<Readonly<AiProviderResponse>>;
}

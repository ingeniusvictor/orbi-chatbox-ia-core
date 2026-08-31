import type { KnowledgeContext } from "./knowledge.js";
import type { AssistantInstruction } from "./assistantInstruction.js";
import type { AssistantRuntimeInstruction } from "./assistantRuntimeInstruction.js";

/** Future-facing local provider input. It is not an executable provider contract. */
export type LocalAiProviderRequest = {
  readonly runtimeId: string;
  readonly model: string;
  readonly requestId: string;
  readonly conversationId: string;
  readonly message: string;
  readonly knowledgeContext: Readonly<KnowledgeContext>;
  readonly assistantInstruction: Readonly<AssistantInstruction>;
  readonly assistantRuntimeInstruction: Readonly<AssistantRuntimeInstruction>;
};

/** Future-facing local provider output, deliberately independent of runtime payloads. */
export type LocalAiProviderResponse = {
  readonly text: string;
  readonly model: string;
  readonly grounded: boolean;
  readonly sourceEntryIds: readonly string[];
};

/** Projection that can later be adapted into an executable provider response. */
export type LocalAiProviderFutureResponse = {
  readonly text: string;
  readonly model: string;
  readonly grounded: boolean;
  readonly sourceEntryIds: readonly string[];
};

/** Implementations may be executable only when explicitly registered. */
export interface LocalAiProviderAdapter {
  generate(request: Readonly<LocalAiProviderRequest>): Promise<Readonly<LocalAiProviderResponse>>;
}

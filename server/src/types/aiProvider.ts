import type { KnowledgeContext } from "./knowledge.js";

/** Architecturally recognized provider identifiers. Only enabled modes are executable. */
export type AiProviderId = "mock" | "openai" | "gemini";

/** Executable modes are deliberately narrower than supported provider identifiers. */
export type AiProviderMode = "mock";

export type AiProviderRequest = {
  readonly requestId: string;
  readonly conversationId: string;
  readonly message: string;
  readonly knowledgeContext: Readonly<KnowledgeContext>;
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

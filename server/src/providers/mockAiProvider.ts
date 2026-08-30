import {
  MAX_KNOWLEDGE_RESPONSE_CHARACTERS,
  NO_KNOWLEDGE_RESPONSE_TEXT,
} from "../services/knowledgeResponseComposer.js";
import type { AiProvider, AiProviderRequest } from "../types/aiProvider.js";

const boundResponseText = (text: string): string =>
  text.length <= MAX_KNOWLEDGE_RESPONSE_CHARACTERS
    ? text
    : `${text.slice(0, MAX_KNOWLEDGE_RESPONSE_CHARACTERS - 3)}...`;

export const mockAiProvider: AiProvider = Object.freeze({
  mode: "mock" as const,
  async generate(request: Readonly<AiProviderRequest>) {
    const entry = request.knowledgeContext.entries[0];
    if (!entry) {
      return Object.freeze({
        text: NO_KNOWLEDGE_RESPONSE_TEXT,
        provider: "mock" as const,
        grounded: false,
        sourceEntryIds: Object.freeze([]),
      });
    }

    return Object.freeze({
      text: boundResponseText(`${entry.title}: ${entry.content}`),
      provider: "mock" as const,
      grounded: true,
      sourceEntryIds: Object.freeze([entry.id]),
    });
  },
});

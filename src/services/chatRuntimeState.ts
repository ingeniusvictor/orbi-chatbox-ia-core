import type { ChatBackendMetadata, ChatBackendSuccessResponse } from "../types/chatBackend";

export type RuntimeChatMessage = {
  readonly id: string;
  readonly sender: "user" | "bot";
  readonly text: string;
  readonly timestamp: string;
  readonly backend?: ChatBackendMetadata;
  readonly voiceOrigin?: "voice";
};

export const isSendableChatMessage = (value: string): boolean => value.trim().length > 0;

export const appendRuntimeMessage = (
  messages: readonly RuntimeChatMessage[],
  message: RuntimeChatMessage,
): RuntimeChatMessage[] => [...messages, message];

export const createBackendAssistantMessage = (
  id: string,
  timestamp: string,
  response: Readonly<ChatBackendSuccessResponse>,
): RuntimeChatMessage => ({
  id,
  sender: "bot",
  text: response.message,
  timestamp,
  backend: { provider: response.provider, grounded: response.grounded, sourceEntryIds: [...response.sourceEntryIds] },
});

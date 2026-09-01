export type ChatBackendRequest = {
  readonly message: string;
  readonly conversationId?: string;
};

export type ChatBackendSuccessResponse = {
  readonly ok: true;
  readonly message: string;
  readonly conversationId: string;
  readonly provider: "mock" | "qwen-local";
  readonly grounded: boolean;
  readonly sourceEntryIds: readonly string[];
};

export type ChatBackendErrorResponse = {
  readonly ok: false;
  readonly errorCode?: string;
  readonly message: string;
};

export type ChatBackendMetadata = Pick<ChatBackendSuccessResponse, "provider" | "grounded" | "sourceEntryIds">;

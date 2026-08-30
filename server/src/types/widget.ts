export type WidgetChannel = "web_demo" | "manual_test" | "whatsapp_future";

export type WidgetMessageRequest = {
  channel?: WidgetChannel | string;
  visitorId?: string;
  message?: string;
  pageUrl?: string;
  consentAccepted?: boolean;
  timestamp?: string;
};

export type NormalizedWidgetMessageRequest = {
  channel: WidgetChannel;
  visitorId: string;
  message: string;
  pageUrl: string;
  consentAccepted: true;
  timestamp: string;
};

export type WidgetMessageProcessingResult = {
  requestId: string;
  channel: WidgetChannel;
  normalizedMessage: string;
  messageLength: number;
  consentAccepted: true;
  receivedAt: string;
  processingMode: "sandbox";
  intent: "unclassified";
};

export type SandboxKnowledgeMetadata = {
  source: "local-static";
  matchCount: number;
  entryIds: readonly string[];
  truncated: boolean;
};

export type WidgetMessageResponse = {
  ok: true;
  mode: "sandbox";
  received: boolean;
  leadCreated: boolean;
  handoffRecommended: boolean;
  message: string;
  responseMode: "knowledge-deterministic";
  grounded: boolean;
  sourceEntryIds: readonly string[];
  guardrails: string[];
  processedAt: string;
  normalizedChannel: WidgetChannel;
  requestId: string;
  conversationId: string;
  normalizedMessage: string;
  messageLength: number;
  processingMode: "sandbox";
  intent: "unclassified";
  knowledge: SandboxKnowledgeMetadata;
};

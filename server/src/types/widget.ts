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

export type WidgetMessageResponse = {
  ok: true;
  mode: "sandbox";
  received: boolean;
  leadCreated: boolean;
  handoffRecommended: boolean;
  message: string;
  guardrails: string[];
  processedAt: string;
  normalizedChannel: WidgetChannel;
};

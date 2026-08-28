export type WidgetChannel = "web_demo" | "manual_test" | "whatsapp_future";

export type WidgetMessageRequest = {
  publicKey?: string;
  channel?: WidgetChannel;
  visitorId?: string;
  message?: string;
  pageUrl?: string;
  consentAccepted?: boolean;
  timestamp?: string;
};

export type WidgetMessageResponse = {
  ok: boolean;
  mode: "sandbox";
  received: boolean;
  leadCreated: boolean;
  handoffRecommended: boolean;
  message: string;
  guardrails: string[];
};

import type { WhatsAppRuntimeConfig } from "../../config/whatsappRuntimeConfig.js";
import { createWhatsAppOutboundTextPayload, type WhatsAppOutboundDeliveryContext, type WhatsAppOutboundTextPayload } from "./whatsappOutboundText.js";
import { createWhatsAppOutboundTemplatePayload, type WhatsAppOutboundTemplatePayload } from "./whatsappOutboundTemplate.js";
import { canExecuteNativeWhatsAppSend, canExecuteNativeWhatsAppTemplateSend } from "./whatsappLiveTestSafety.js";

export type WhatsAppGraphErrorCode =
  | "WHATSAPP_NOT_CONFIGURED"
  | "WHATSAPP_AUTH_FAILED"
  | "WHATSAPP_REQUEST_REJECTED"
  | "WHATSAPP_RATE_LIMITED"
  | "WHATSAPP_TIMEOUT"
  | "WHATSAPP_NETWORK_FAILED"
  | "WHATSAPP_INVALID_RESPONSE"
  | "WHATSAPP_LIVE_SEND_LOCKED";

export type WhatsAppGraphTransportRequest = Readonly<{
  endpoint: string;
  method: "POST";
  headers: Readonly<Record<"authorization" | "content-type", string>>;
  body: string;
  timeoutMs: number;
}>;
export type WhatsAppGraphTransportResponse = Readonly<{ status: number; body: string }>;
export type WhatsAppGraphTransport = ((request: Readonly<WhatsAppGraphTransportRequest>) => Promise<Readonly<WhatsAppGraphTransportResponse>>) & Readonly<{ kind?: "native" }>;
export type WhatsAppGraphSendResult =
  | Readonly<{ ok: true; accepted: true; providerMessageId?: string }>
  | Readonly<{ ok: false; errorCode: WhatsAppGraphErrorCode }>;

const GRAPH_BASE_URL = "https://graph.facebook.com";
const DEFAULT_TIMEOUT_MS = 10_000;
const validComponent = (value: string | undefined): value is string => Boolean(value && /^[A-Za-z0-9_-]{1,120}$/.test(value));

/** Builds the official endpoint from validated configuration only; no arbitrary URL is accepted. */
export const buildWhatsAppGraphMessagesEndpoint = (config: Readonly<WhatsAppRuntimeConfig>): string | undefined => {
  if (config.outboundReadiness !== "ready-for-outbound" || !/^v\d+\.\d+$/.test(config.graphApiVersion ?? "") || !validComponent(config.phoneNumberId)) return undefined;
  return `${GRAPH_BASE_URL}/${config.graphApiVersion}/${config.phoneNumberId}/messages`;
};

const normalizeStatus = (status: number): WhatsAppGraphErrorCode => {
  if (status === 401 || status === 403) return "WHATSAPP_AUTH_FAILED";
  if (status === 429) return "WHATSAPP_RATE_LIMITED";
  return "WHATSAPP_REQUEST_REJECTED";
};
const providerMessageIdFrom = (body: unknown): string | undefined => {
  if (!body || typeof body !== "object" || Array.isArray(body)) return undefined;
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || !messages[0] || typeof messages[0] !== "object") return undefined;
  const id = (messages[0] as { id?: unknown }).id;
  return typeof id === "string" && id.length > 0 && id.length <= 120 ? id : undefined;
};

/** Native transport exists for a later authorized live test; B.1 QA injects a fake transport. */
export const createNativeWhatsAppGraphTransport = (): WhatsAppGraphTransport => Object.assign(async (request: Readonly<WhatsAppGraphTransportRequest>) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), request.timeoutMs);
  try {
    const response = await fetch(request.endpoint, { method: request.method, headers: request.headers, body: request.body, redirect: "error", signal: controller.signal });
    return Object.freeze({ status: response.status, body: await response.text() });
  } finally { clearTimeout(timeout); }
}, Object.freeze({ kind: "native" as const }));

export class WhatsAppGraphClient {
  constructor(
    private readonly config: Readonly<WhatsAppRuntimeConfig>,
    private readonly transport: WhatsAppGraphTransport = createNativeWhatsAppGraphTransport(),
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  async sendText(context: Readonly<WhatsAppOutboundDeliveryContext>, text: string): Promise<WhatsAppGraphSendResult> {
    let payload: Readonly<WhatsAppOutboundTextPayload>;
    try { payload = createWhatsAppOutboundTextPayload(context, text); } catch { return Object.freeze({ ok: false, errorCode: "WHATSAPP_REQUEST_REJECTED" }); }
    return this.sendPayload(context, payload, canExecuteNativeWhatsAppSend);
  }

  async sendTemplate(context: Readonly<WhatsAppOutboundDeliveryContext>): Promise<WhatsAppGraphSendResult> {
    let payload: Readonly<WhatsAppOutboundTemplatePayload>;
    try {
      if (!this.config.testTemplateName || !this.config.testTemplateLanguageCode) throw new Error("Missing template configuration.");
      payload = createWhatsAppOutboundTemplatePayload(context, this.config.testTemplateName, this.config.testTemplateLanguageCode);
    } catch { return Object.freeze({ ok: false, errorCode: "WHATSAPP_NOT_CONFIGURED" }); }
    return this.sendPayload(context, payload, canExecuteNativeWhatsAppTemplateSend);
  }

  private async sendPayload(
    context: Readonly<WhatsAppOutboundDeliveryContext>,
    payload: Readonly<WhatsAppOutboundTextPayload | WhatsAppOutboundTemplatePayload>,
    nativeGuard: (config: Readonly<WhatsAppRuntimeConfig>, recipient: string) => boolean,
  ): Promise<WhatsAppGraphSendResult> {
    const endpoint = buildWhatsAppGraphMessagesEndpoint(this.config);
    if (!endpoint || !this.config.accessToken || !Number.isSafeInteger(this.timeoutMs) || this.timeoutMs < 100 || this.timeoutMs > 30_000) return Object.freeze({ ok: false, errorCode: "WHATSAPP_NOT_CONFIGURED" });
    if (this.transport.kind === "native" && !nativeGuard(this.config, context.recipient)) return Object.freeze({ ok: false, errorCode: "WHATSAPP_LIVE_SEND_LOCKED" });
    try {
      const response = await this.transport(Object.freeze({ endpoint, method: "POST", headers: Object.freeze({ authorization: `Bearer ${this.config.accessToken}`, "content-type": "application/json" }), body: JSON.stringify(payload), timeoutMs: this.timeoutMs }));
      if (!Number.isInteger(response.status) || response.status < 200 || response.status > 299) return Object.freeze({ ok: false, errorCode: normalizeStatus(response.status) });
      let body: unknown;
      try { body = JSON.parse(response.body); } catch { return Object.freeze({ ok: false, errorCode: "WHATSAPP_INVALID_RESPONSE" }); }
      const providerMessageId = providerMessageIdFrom(body);
      return Object.freeze({ ok: true, accepted: true, ...(providerMessageId ? { providerMessageId } : {}) });
    } catch (error) {
      return Object.freeze({ ok: false, errorCode: error instanceof DOMException && error.name === "AbortError" ? "WHATSAPP_TIMEOUT" : "WHATSAPP_NETWORK_FAILED" });
    }
  }
}

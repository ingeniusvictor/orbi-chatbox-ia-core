export const DEFAULT_RECEIVER_URL = "http://localhost:8787";
export const DEFAULT_PUBLIC_KEY = "orbi_demo_widget_key";

export type BackendReceiverChannel = "manual_test" | "web_demo" | "whatsapp_future";

export type BackendReceiverSendInput = {
  receiverUrl?: string;
  publicKey?: string;
  message: string;
  channel?: BackendReceiverChannel;
  visitorId?: string;
  pageUrl?: string;
  conversationId?: string;
};

export type BackendReceiverSendResult =
  | {
      ok: true;
      status: number;
      body: Readonly<ChatBackendSuccessResponse>;
      received: true;
      leadCreated: false;
      normalizedChannel?: string;
      processedAt?: string;
    }
  | {
      ok: false;
      status: number | null;
      errorCode?: string;
      message: string;
      body?: unknown;
    };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const isAllowedLocalReceiverUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      Boolean(url.port)
    );
  } catch {
    return false;
  }
};

const readResponseBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return { nonJsonResponse: "El receiver respondió contenido no JSON." };
  }
};

export const sendMessageToBackendReceiver = async (
  input: BackendReceiverSendInput,
): Promise<BackendReceiverSendResult> => {
  const receiverUrl = (input.receiverUrl ?? DEFAULT_RECEIVER_URL).trim();
  const publicKey = (input.publicKey ?? DEFAULT_PUBLIC_KEY).trim();

  if (!isAllowedLocalReceiverUrl(receiverUrl)) {
    return {
      ok: false,
      status: null,
      message: "Solo se permiten URLs locales para este receiver sandbox.",
    };
  }

  try {
    const response = await fetch(
      `${receiverUrl.replace(/\/+$/, "")}/api/public/widget/${encodeURIComponent(publicKey)}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: input.channel ?? "web_demo",
          visitorId: input.visitorId ?? "local-sandbox-visitor",
          message: input.message,
          pageUrl: input.pageUrl ?? "http://localhost:3000",
          conversationId: input.conversationId,
          consentAccepted: true,
          timestamp: new Date().toISOString(),
        }),
      },
    );
    const body = await readResponseBody(response);

    if (!response.ok) {
      const error = parseErrorResponse(body, `El receiver respondió HTTP ${response.status}.`);
      return {
        ok: false,
        status: response.status,
        errorCode: error.errorCode,
        message: error.message,
        body,
      };
    }

    const success = parseSuccessResponse(body);
    if (!success) return { ok: false, status: response.status, errorCode: "INVALID_BACKEND_RESPONSE", message: "El backend sandbox respondió un contrato no válido.", body };
    return {
      ok: true,
      status: response.status,
      body: success,
      received: true,
      leadCreated: false,
      normalizedChannel: isRecord(body) && typeof body.normalizedChannel === "string"
        ? body.normalizedChannel
        : undefined,
      processedAt: isRecord(body) && typeof body.processedAt === "string" ? body.processedAt : undefined,
    };
  } catch {
    return {
      ok: false,
      status: null,
      message: "Backend sandbox no disponible. Ejecuta npm run server:dev.",
    };
  }
};
import type { ChatBackendErrorResponse, ChatBackendRequest, ChatBackendSuccessResponse } from "../types/chatBackend";
const parseSuccessResponse = (body: unknown): ChatBackendSuccessResponse | undefined => {
  if (!isRecord(body) || body.ok !== true || typeof body.message !== "string" || typeof body.conversationId !== "string" || (body.provider !== "mock" && body.provider !== "qwen-local") || typeof body.grounded !== "boolean" || !Array.isArray(body.sourceEntryIds) || !body.sourceEntryIds.every((id) => typeof id === "string")) return undefined;
  return { ok: true, message: body.message, conversationId: body.conversationId, provider: body.provider, grounded: body.grounded, sourceEntryIds: Object.freeze([...body.sourceEntryIds]) };
};

const parseErrorResponse = (body: unknown, fallback: string): ChatBackendErrorResponse => ({
  ok: false,
  errorCode: isRecord(body) && typeof body.errorCode === "string" ? body.errorCode : undefined,
  message: isRecord(body) && typeof body.message === "string" ? body.message : fallback,
});

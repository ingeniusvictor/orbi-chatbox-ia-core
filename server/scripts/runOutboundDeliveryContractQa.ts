import { webReferenceDeliveryAdapter } from "../src/adapters/webReferenceDeliveryAdapter.js";
import { createOutboundDeliveryRequest, executeOutboundDelivery } from "../src/services/channelDeliveryService.js";
import {
  OutboundDeliveryValidationError,
  validateOutboundDeliveryRequest,
  type OutboundDeliveryRequest,
} from "../src/types/outboundDelivery.js";
import type { ChannelDeliveryAdapter } from "../src/types/channelDeliveryAdapter.js";
import type { OutboundChannelResponse } from "../src/types/channelMessage.js";
import { ControlledChannelRouter } from "../src/services/controlledChannelRouter.js";
import type { AiProvider } from "../src/types/aiProvider.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const response: OutboundChannelResponse = Object.freeze({
  channel: "web",
  conversationId: "orbi-local-conversation",
  responseType: "text",
  text: "Respuesta local de LUMI.",
  createdAt: "2026-09-05T00:00:00.000Z",
});

try {
  const request = createOutboundDeliveryRequest(response);
  assert(request.deliveryId !== request.conversationId && request.deliveryId !== "external-provider-message", "Delivery ID must be opaque and ORBI-local.");
  assert(request.channel === "web" && request.response === response, "Delivery request must reuse the neutral outbound response.");
  const delivered = await executeOutboundDelivery(request, webReferenceDeliveryAdapter);
  assert(delivered.status === "delivered" && delivered.channel === "web" && delivered.completedAt, "Web reference delivery must complete at the local HTTP boundary.");

  const provider: AiProvider = Object.freeze({ mode: "mock", async generate() { return Object.freeze({ provider: "mock", text: "Respuesta entregable", grounded: false, sourceEntryIds: [] }); } });
  const routed = await new ControlledChannelRouter().route({ channel: "web", rawInput: Object.freeze({ text: "Prueba de entrega", receivedAt: "2026-09-05T00:00:00.000Z" }), activeProviderMode: "mock", providerOverride: provider });
  assert(routed.ok && routed.delivery.status === "delivered" && routed.delivery.channel === "web", "The canonical router must deliver the generated response through the reference adapter.");

  const unavailable = await executeOutboundDelivery(createOutboundDeliveryRequest(Object.freeze({ ...response, channel: "whatsapp" })), webReferenceDeliveryAdapter);
  assert(unavailable.status === "failed" && unavailable.errorCode === "DELIVERY_CHANNEL_UNAVAILABLE", "Unavailable channel must fail with a bounded error.");

  const throwingAdapter: ChannelDeliveryAdapter = Object.freeze({ async deliver(): Promise<never> { throw new Error("provider details must not escape"); } });
  const controlledFailure = await executeOutboundDelivery(createOutboundDeliveryRequest(Object.freeze({ ...response, conversationId: "orbi-failure-conversation" })), throwingAdapter);
  assert(controlledFailure.status === "failed" && controlledFailure.errorCode === "DELIVERY_FAILED", "Adapter exceptions must become a controlled result.");

  let invalidRejected = false;
  try { validateOutboundDeliveryRequest({ ...request, deliveryId: "" } as OutboundDeliveryRequest); } catch (error) { invalidRejected = error instanceof OutboundDeliveryValidationError; }
  assert(invalidRejected, "Invalid delivery request must be rejected.");
  console.info("Outbound Delivery Contract QA: PASS (neutral contract, local web handoff, controlled failure, no provider payload)");
} catch (error) { console.error(error); process.exit(1); }

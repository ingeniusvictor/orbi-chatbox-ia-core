import { ChannelDeliveryService } from "../src/services/channelDeliveryService.js";
import { InMemoryDeliveryLifecycleStore } from "../src/services/inMemoryDeliveryLifecycleStore.js";
import { DeliveryLifecycleError } from "../src/types/deliveryLifecycle.js";
import type { ChannelDeliveryAdapter } from "../src/types/channelDeliveryAdapter.js";
import type { OutboundDeliveryRequest, OutboundDeliveryResult } from "../src/types/outboundDelivery.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const request = (deliveryId: string, text = "Respuesta local"): OutboundDeliveryRequest => Object.freeze({
  deliveryId,
  channel: "web",
  conversationId: "orbi-conversation",
  response: Object.freeze({ channel: "web", conversationId: "orbi-conversation", responseType: "text", text, createdAt: "2026-09-05T00:00:00.000Z" }),
  createdAt: "2026-09-05T00:00:00.000Z",
});

try {
  let executionCount = 0;
  const deliveredAdapter: ChannelDeliveryAdapter = Object.freeze({
    async deliver(input): Promise<Readonly<OutboundDeliveryResult>> {
      executionCount += 1;
      await Promise.resolve();
      return Object.freeze({ deliveryId: input.deliveryId, channel: input.channel, status: "delivered", completedAt: "2026-09-05T00:00:01.000Z" });
    },
  });
  const store = new InMemoryDeliveryLifecycleStore();
  const service = new ChannelDeliveryService(store);
  const firstRequest = request("delivery-once");
  const [first, duplicate] = await Promise.all([service.deliver(firstRequest, deliveredAdapter), service.deliver(firstRequest, deliveredAdapter)]);
  assert(first.status === "delivered" && duplicate.status === "delivered" && executionCount === 1, "Equivalent duplicate must use one adapter execution and one terminal result.");

  let terminalAdapterCalls = 0;
  const terminalAdapter: ChannelDeliveryAdapter = Object.freeze({ async deliver(): Promise<Readonly<OutboundDeliveryResult>> { terminalAdapterCalls += 1; throw new Error("must not execute"); } });
  const replay = await service.deliver(firstRequest, terminalAdapter);
  assert(replay.status === "delivered" && terminalAdapterCalls === 0, "Terminal delivery must return its prior result without execution.");

  let conflict = false;
  try { await service.deliver(request("delivery-once", "Other response"), deliveredAdapter); } catch (error) { conflict = error instanceof DeliveryLifecycleError && error.code === "DELIVERY_DUPLICATE_CONFLICT"; }
  assert(conflict, "Conflicting duplicate must reject safely.");

  const failedService = new ChannelDeliveryService(new InMemoryDeliveryLifecycleStore());
  let failedCalls = 0;
  const failedAdapter: ChannelDeliveryAdapter = Object.freeze({ async deliver(input): Promise<Readonly<OutboundDeliveryResult>> { failedCalls += 1; return Object.freeze({ deliveryId: input.deliveryId, channel: input.channel, status: "failed", completedAt: "2026-09-05T00:00:01.000Z", errorCode: "DELIVERY_CHANNEL_UNAVAILABLE" }); } });
  const failedRequest = request("delivery-failed-once");
  assert((await failedService.deliver(failedRequest, failedAdapter)).status === "failed", "Controlled adapter failure must persist as failed.");
  assert((await failedService.deliver(failedRequest, deliveredAdapter)).status === "failed" && failedCalls === 1, "Failed terminal state must not execute another adapter.");
  assert(failedService.release(failedRequest.deliveryId), "Explicit release must remove only this terminal lifecycle record.");
  assert((await failedService.deliver(failedRequest, deliveredAdapter)).status === "delivered", "Released lifecycle may accept a new local attempt.");
  console.info("Delivery Idempotency QA: PASS (single adapter execution, conflict safety, terminal replay, explicit release)");
} catch (error) { console.error(error); process.exit(1); }

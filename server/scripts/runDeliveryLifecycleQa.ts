import { InMemoryDeliveryLifecycleStore } from "../src/services/inMemoryDeliveryLifecycleStore.js";
import { DeliveryLifecycleError } from "../src/types/deliveryLifecycle.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const timestamp = "2026-09-05T00:00:00.000Z";
const input = (deliveryId: string, text = "Respuesta local"): Parameters<InMemoryDeliveryLifecycleStore["createPending"]>[0] =>
  Object.freeze({ deliveryId, channel: "web", conversationId: "orbi-conversation", responseType: "text", responseText: text, createdAt: timestamp });
const rejects = (work: () => unknown, code: string): boolean => {
  try { work(); return false; } catch (error) { return error instanceof DeliveryLifecycleError && error.code === code; }
};

try {
  const store = new InMemoryDeliveryLifecycleStore(2);
  const delivered = store.createPending(input("delivery-delivered"));
  assert(delivered.status === "pending", "New record must begin pending.");
  assert(store.markDelivered(delivered.deliveryId, "2026-09-05T00:00:01.000Z").status === "delivered", "Pending delivery must complete delivered.");
  assert(store.markDelivered(delivered.deliveryId, "2026-09-05T00:00:02.000Z").status === "delivered", "Repeated delivered result must be idempotent.");
  assert(rejects(() => store.markFailed(delivered.deliveryId, "DELIVERY_FAILED", "2026-09-05T00:00:03.000Z"), "DELIVERY_INVALID_TRANSITION"), "Delivered cannot become failed.");

  const failed = store.createPending(input("delivery-failed"));
  assert(store.markFailed(failed.deliveryId, "DELIVERY_FAILED", "2026-09-05T00:00:01.000Z").status === "failed", "Pending delivery must complete failed.");
  assert(store.markFailed(failed.deliveryId, "DELIVERY_FAILED", "2026-09-05T00:00:02.000Z").status === "failed", "Repeated equivalent failed result must be idempotent.");
  assert(rejects(() => store.markDelivered(failed.deliveryId, "2026-09-05T00:00:03.000Z"), "DELIVERY_INVALID_TRANSITION"), "Failed cannot become delivered.");
  assert(rejects(() => store.createPending(input("delivery-delivered", "Conflicting response")), "DELIVERY_DUPLICATE_CONFLICT"), "Conflicting duplicate must be rejected.");
  assert(store.release(delivered.deliveryId) && store.resolve(delivered.deliveryId) === undefined, "Exact terminal release must remove only lifecycle metadata.");
  assert(store.createPending(input("delivery-capacity")).status === "pending", "Released capacity must accept a new delivery.");
  assert(rejects(() => store.createPending(input("delivery-over-capacity")), "DELIVERY_CAPACITY_REACHED"), "Capacity must reject new records without eviction.");
  assert(store.resolve(failed.deliveryId)?.status === "failed", "Existing lifecycle record must remain resolvable at capacity.");
  console.info("Delivery Lifecycle QA: PASS (bounded pending/terminal transitions, idempotency, exact release, no eviction)");
} catch (error) { console.error(error); process.exit(1); }

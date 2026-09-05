import {
  OutboundDeliveryValidationError,
  validateOutboundDeliveryResult,
} from "../src/types/outboundDelivery.js";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const base = Object.freeze({ deliveryId: "orbi-delivery-id", channel: "web" as const });
const completedAt = "2026-09-05T00:00:00.000Z";
const rejects = (input: Parameters<typeof validateOutboundDeliveryResult>[0]): boolean => {
  try { validateOutboundDeliveryResult(input); return false; } catch (error) { return error instanceof OutboundDeliveryValidationError; }
};

try {
  const pending = validateOutboundDeliveryResult({ ...base, status: "pending" });
  const delivered = validateOutboundDeliveryResult({ ...base, status: "delivered", completedAt });
  const failed = validateOutboundDeliveryResult({ ...base, status: "failed", completedAt, errorCode: "DELIVERY_FAILED" });
  assert(pending.status === "pending" && delivered.status === "delivered" && failed.status === "failed", "All bounded delivery states must validate.");
  assert(rejects({ ...base, status: "pending", completedAt }), "Pending state must not claim completion.");
  assert(rejects({ ...base, status: "delivered" }), "Delivered state requires completion time.");
  assert(rejects({ ...base, status: "failed", completedAt }), "Failed state requires a bounded error code.");
  assert(rejects({ ...base, status: "failed", completedAt, errorCode: "PROVIDER_RAW_ERROR" as never }), "Provider-specific errors must not enter the generic result.");
  console.info("Delivery State QA: PASS (pending/delivered/failed semantics are bounded; no receipt or retry state)");
} catch (error) { console.error(error); process.exit(1); }

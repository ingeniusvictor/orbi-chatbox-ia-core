import type { ChannelId } from "../types/channelMessage.js";
import { createHash } from "node:crypto";
import type { DeliveryLifecycleRecord, DeliveryLifecycleStore } from "../types/deliveryLifecycle.js";
import { DeliveryLifecycleError } from "../types/deliveryLifecycle.js";
import type { OutboundDeliveryErrorCode } from "../types/outboundDelivery.js";

export const DEFAULT_MAX_DELIVERY_LIFECYCLE_RECORDS = 100;

type StoredLifecycle = Readonly<{ record: DeliveryLifecycleRecord; fingerprint: string }>;
type PendingInput = Parameters<DeliveryLifecycleStore["createPending"]>[0];

const validId = (value: string): boolean => value.trim().length > 0 && value.length <= 120;
const validTimestamp = (value: string): boolean => Number.isFinite(Date.parse(value));
const fingerprintFor = (input: Readonly<PendingInput>): string =>
  createHash("sha256").update(`${input.channel}\u0000${input.conversationId}\u0000${input.responseType}\u0000${input.responseText}`, "utf8").digest("hex");

/** Process-local bounded delivery metadata only. No response body, provider payload or persistence is retained. */
export class InMemoryDeliveryLifecycleStore implements DeliveryLifecycleStore {
  private readonly records = new Map<string, StoredLifecycle>();

  constructor(private readonly maxEntries = DEFAULT_MAX_DELIVERY_LIFECYCLE_RECORDS) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries < 1 || maxEntries > 10_000) {
      throw new DeliveryLifecycleError("DELIVERY_CAPACITY_REACHED", "Delivery lifecycle capacity is invalid.");
    }
  }

  resolve(deliveryId: string): DeliveryLifecycleRecord | undefined {
    if (!validId(deliveryId)) throw new DeliveryLifecycleError("DELIVERY_NOT_FOUND", "Delivery ID is invalid.");
    return this.records.get(deliveryId)?.record;
  }

  createPending(input: Readonly<PendingInput>): DeliveryLifecycleRecord {
    if (!validId(input.deliveryId) || !validId(input.conversationId) || !validTimestamp(input.createdAt) || !input.responseText.trim() || input.responseText.length > 2_000) {
      throw new DeliveryLifecycleError("DELIVERY_DUPLICATE_CONFLICT", "Delivery lifecycle input is invalid.");
    }
    const fingerprint = fingerprintFor(input);
    const existing = this.records.get(input.deliveryId);
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new DeliveryLifecycleError("DELIVERY_DUPLICATE_CONFLICT", "Delivery ID conflicts with an existing request.");
      return existing.record;
    }
    if (this.records.size >= this.maxEntries) throw new DeliveryLifecycleError("DELIVERY_CAPACITY_REACHED", "Delivery lifecycle capacity is reached.");
    const record: DeliveryLifecycleRecord = Object.freeze({
      deliveryId: input.deliveryId,
      channel: input.channel,
      status: "pending",
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
    });
    this.records.set(input.deliveryId, Object.freeze({ record, fingerprint }));
    return record;
  }

  markDelivered(deliveryId: string, completedAt: string): DeliveryLifecycleRecord {
    const stored = this.requireRecord(deliveryId);
    if (!validTimestamp(completedAt)) throw new DeliveryLifecycleError("DELIVERY_INVALID_TRANSITION", "Delivery completion timestamp is invalid.");
    if (stored.record.status === "delivered") return stored.record;
    if (stored.record.status !== "pending") throw new DeliveryLifecycleError("DELIVERY_INVALID_TRANSITION", "Delivery is already terminal.");
    return this.replace(stored, Object.freeze({ ...stored.record, status: "delivered", updatedAt: completedAt }));
  }

  markFailed(deliveryId: string, errorCode: OutboundDeliveryErrorCode, completedAt: string): DeliveryLifecycleRecord {
    const stored = this.requireRecord(deliveryId);
    if (!validTimestamp(completedAt)) throw new DeliveryLifecycleError("DELIVERY_INVALID_TRANSITION", "Delivery completion timestamp is invalid.");
    if (stored.record.status === "failed" && stored.record.errorCode === errorCode) return stored.record;
    if (stored.record.status !== "pending") throw new DeliveryLifecycleError("DELIVERY_INVALID_TRANSITION", "Delivery is already terminal.");
    return this.replace(stored, Object.freeze({ ...stored.record, status: "failed", updatedAt: completedAt, errorCode }));
  }

  release(deliveryId: string): boolean {
    const stored = this.requireRecord(deliveryId);
    if (stored.record.status === "pending") throw new DeliveryLifecycleError("DELIVERY_INVALID_TRANSITION", "Pending delivery cannot be released.");
    return this.records.delete(deliveryId);
  }

  private requireRecord(deliveryId: string): StoredLifecycle {
    const stored = this.records.get(deliveryId);
    if (!stored) throw new DeliveryLifecycleError("DELIVERY_NOT_FOUND", "Delivery lifecycle record was not found.");
    return stored;
  }

  private replace(stored: StoredLifecycle, record: DeliveryLifecycleRecord): DeliveryLifecycleRecord {
    this.records.set(record.deliveryId, Object.freeze({ record, fingerprint: stored.fingerprint }));
    return record;
  }
}

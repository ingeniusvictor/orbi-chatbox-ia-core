import type { ChannelId } from "./channelMessage.js";
import type { OutboundDeliveryErrorCode, OutboundDeliveryStatus } from "./outboundDelivery.js";

export type DeliveryLifecycleRecord = Readonly<{
  deliveryId: string;
  channel: ChannelId;
  status: OutboundDeliveryStatus;
  createdAt: string;
  updatedAt: string;
  errorCode?: OutboundDeliveryErrorCode;
}>;

export type DeliveryLifecycleErrorCode =
  | "DELIVERY_DUPLICATE_CONFLICT"
  | "DELIVERY_INVALID_TRANSITION"
  | "DELIVERY_CAPACITY_REACHED"
  | "DELIVERY_NOT_FOUND";

export class DeliveryLifecycleError extends Error {
  constructor(readonly code: DeliveryLifecycleErrorCode, message: string) {
    super(message);
    this.name = "DeliveryLifecycleError";
  }
}

export interface DeliveryLifecycleStore {
  resolve(deliveryId: string): DeliveryLifecycleRecord | undefined;
  createPending(input: Readonly<{ deliveryId: string; channel: ChannelId; conversationId: string; responseType: string; responseText: string; createdAt: string }>): DeliveryLifecycleRecord;
  markDelivered(deliveryId: string, completedAt: string): DeliveryLifecycleRecord;
  markFailed(deliveryId: string, errorCode: OutboundDeliveryErrorCode, completedAt: string): DeliveryLifecycleRecord;
  /** Removes one terminal lifecycle record only; it never changes Core or correlation state. */
  release(deliveryId: string): boolean;
}

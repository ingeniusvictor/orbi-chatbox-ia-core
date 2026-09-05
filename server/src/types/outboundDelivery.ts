import { CHANNEL_IDS, type ChannelId, type OutboundChannelResponse } from "./channelMessage.js";

export const OUTBOUND_DELIVERY_STATUSES = ["pending", "delivered", "failed"] as const;
export type OutboundDeliveryStatus = (typeof OUTBOUND_DELIVERY_STATUSES)[number];

export const OUTBOUND_DELIVERY_ERROR_CODES = [
  "DELIVERY_CHANNEL_UNAVAILABLE",
  "DELIVERY_FAILED",
] as const;
export type OutboundDeliveryErrorCode = (typeof OUTBOUND_DELIVERY_ERROR_CODES)[number];

/** Internal handoff request. It deliberately contains no provider payload or provider identifier. */
export type OutboundDeliveryRequest = Readonly<{
  deliveryId: string;
  channel: ChannelId;
  conversationId: string;
  response: Readonly<OutboundChannelResponse>;
  createdAt: string;
}>;

/** A channel-boundary outcome, not a provider receipt or an end-user read status. */
export type OutboundDeliveryResult = Readonly<{
  deliveryId: string;
  channel: ChannelId;
  status: OutboundDeliveryStatus;
  completedAt?: string;
  errorCode?: OutboundDeliveryErrorCode;
}>;

export class OutboundDeliveryValidationError extends Error {
  constructor(message: string) { super(message); this.name = "OutboundDeliveryValidationError"; }
}

const validTimestamp = (value: string): boolean => Number.isFinite(Date.parse(value));
const validInternalId = (value: string): boolean => value.trim().length > 0 && value.length <= 120;

export const validateOutboundDeliveryRequest = (input: Readonly<OutboundDeliveryRequest>): Readonly<OutboundDeliveryRequest> => {
  if (!CHANNEL_IDS.includes(input.channel) || !validInternalId(input.deliveryId) || !validInternalId(input.conversationId) || !validTimestamp(input.createdAt)) {
    throw new OutboundDeliveryValidationError("Outbound delivery request is invalid.");
  }
  if (input.channel !== input.response.channel || input.conversationId !== input.response.conversationId) {
    throw new OutboundDeliveryValidationError("Outbound delivery request identity does not match its response.");
  }
  return Object.freeze({ ...input });
};

export const validateOutboundDeliveryResult = (input: Readonly<OutboundDeliveryResult>): Readonly<OutboundDeliveryResult> => {
  if (!CHANNEL_IDS.includes(input.channel) || !validInternalId(input.deliveryId) || !OUTBOUND_DELIVERY_STATUSES.includes(input.status)) {
    throw new OutboundDeliveryValidationError("Outbound delivery result is invalid.");
  }
  if (input.status === "pending" && (input.completedAt !== undefined || input.errorCode !== undefined)) {
    throw new OutboundDeliveryValidationError("Pending delivery cannot be completed.");
  }
  if (input.status === "delivered" && (!input.completedAt || input.errorCode !== undefined || !validTimestamp(input.completedAt))) {
    throw new OutboundDeliveryValidationError("Delivered result is invalid.");
  }
  if (input.status === "failed" && (!input.completedAt || !input.errorCode || !OUTBOUND_DELIVERY_ERROR_CODES.includes(input.errorCode) || !validTimestamp(input.completedAt))) {
    throw new OutboundDeliveryValidationError("Failed result is invalid.");
  }
  return Object.freeze({ ...input });
};

import { randomUUID } from "node:crypto";

/** Creates one opaque ORBI-local delivery identity; it is never a provider message ID. */
export const createInternalDeliveryId = (): string => randomUUID();

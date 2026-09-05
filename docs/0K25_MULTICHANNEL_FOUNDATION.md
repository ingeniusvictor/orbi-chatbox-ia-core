# 0K-25 — Multi-Channel Messaging Foundation

## Objective

0K-25A.1 defines a local, channel-neutral contract. A channel adapter normalizes an inbound message, the existing ORBI Core/LUMI path produces a normalized response, and that adapter formats its own outbound representation.

## Contracts and identity boundary

`InboundChannelMessage` supports bounded `text` and `voice-transcript` messages. It carries optional external IDs only as adapter metadata. An `externalUserId` is not an ORBI user identity, and an `externalConversationId` is not an ORBI `conversationId`. There is no auth, user mapping, database or persistence. Any future external-to-ORBI conversation mapping stays outside the Core.

`OutboundChannelResponse` is separate and contains only a text response, the existing ORBI conversation ID, timestamp and bounded grounding metadata. Provider raw payloads are never part of either contract.

## Current adapters and status

| Channel | Status | Scope |
| --- | --- | --- |
| web | implemented / available | Reference adapter proving normalized text ingress/egress through the existing local Core. |
| widget | implemented / available | Deliberately reuses the web adapter; no voice capability is claimed here. |
| whatsapp | planned / unavailable | **NOT IMPLEMENTED**. No Meta webhook, HTTP call, token, QR/session or provider SDK exists. |
| internal | disabled | Reserved local boundary descriptor only. |

## Registry and controlled routing

`ChannelAdapterRegistry` is static local composition. It resolves a descriptor, implementation status, capability declaration and runtime availability separately; unknown, planned, disabled and adapter-unavailable channels receive stable controlled errors with no fallback.

`ControlledChannelRouter` selects the adapter before normalization. Only a normalized `InboundChannelMessage` reaches `ChannelMessageBridge`; the existing Core returns `OutboundChannelResponse` before the adapter formats its local representation. The architectural invariant is: **Core does not know or care which channel originated the message.**

The current widget has no distinct transport behavior, so it deliberately reuses the web adapter rather than duplicating adapter code. `internal` is retained only as a disabled descriptor; it has no runtime route. WhatsApp has a planned descriptor and unavailable runtime, but no adapter at all. Its routing attempts return `CHANNEL_NOT_IMPLEMENTED`.

## 0K-25A — CLOSED

- **A.1 — Channel contracts + adapter boundary:** bounded neutral ingress/egress contracts and a reference web adapter.
- **A.2 — Adapter registry + controlled routing:** deterministic static resolution, explicit status/availability and no fallback.
- **A.3 — Real route integration:** the existing local receiver uses the controlled router without changing its compatible HTTP contract.

**Architectural invariant:** **ORBI Core does not know or care which channel originated the message.**

Next family: **0K-25B — External Conversation Correlation & Channel Identity Boundary**.

## 0K-25B.1 — External Conversation Correlation

**Architectural invariant:** **External channel identity is correlation data, not ORBI identity.**

`ExternalConversationKey` is a bounded, channel-aware pair of `channel` and `externalConversationId`; equal external IDs from different channels resolve independently. `InternalConversationRef` contains only the existing opaque ORBI UUID conversation ID. The process-local `InMemoryConversationCorrelationStore` is ephemeral and has no database, disk persistence, local storage or external service.

`externalUserId` is channel metadata only: it is not an ORBI user, account or authentication principal. The current web/widget client already re-sends the ORBI-generated `conversationId` returned by the receiver, so that existing internal ID remains authoritative and is preserved without migration. Correlation is used only when an adapter explicitly provides an `externalConversationId` and no existing internal ID is supplied.

This prepares a future channel boundary without adding a WhatsApp adapter, Meta webhook, token, phone-number logic, media handling or message delivery.

## 0K-25B.2 — Correlation Lifecycle

The ephemeral lifecycle is `UNBOUND → BOUND → RESOLVED`, with explicit `RELEASED` removal of one exact channel-aware key. Rebinding the same key to the same internal reference is idempotent; a different reference is rejected as `CORRELATION_CONFLICT`, so no mapping silently changes.

The in-memory store holds at most 100 mappings per process. New mappings reject with `CORRELATION_CAPACITY_REACHED` when full; no implicit eviction is performed. `release` removes only a correlation entry and never removes ORBI conversation history. TTL is deliberately deferred: process restart clears the store by design, with no background timer or persistence.

An explicit valid ORBI `conversationId` remains authoritative over external correlation. `externalUserId` alone never correlates a conversation.

## 0K-25B.3 — Correlation Integration Review

Final authority order is: (1) an explicit valid ORBI `conversationId`; (2) a channel-aware external correlation when no internal ID exists; (3) the existing safe Core UUID creation when neither exists. When an authoritative internal ID and an external mapping disagree, the internal ID is used and the external mapping remains untouched; no silent rebinding occurs.

Router integration proves repeat continuity, cross-channel isolation, exact release without history deletion, and capacity rejection without eviction. The existing public web/widget HTTP contract is unchanged and does not normalize `externalConversationId`; correlation is additive at the adapter/router boundary. Core, Knowledge, LUMI and providers have no correlation dependency or external identity visibility.

## 0K-25B — CLOSED

- **B.1 — Correlation contract + identity boundary:** external channel identity is bounded correlation data, never ORBI identity.
- **B.2 — Lifecycle + bounded capacity:** idempotent bind, conflict rejection, exact release, 100 in-memory mappings per process and no eviction.
- **B.3 — Integration + authority certification:** internal IDs remain authoritative; router-level correlation is isolated from Core and the compatible HTTP route.

**Architectural invariant:** **External channel identity is correlation data, not ORBI identity.**

The correlation store is process-local, non-production and reset on backend restart. No persistence is attempted. Next family: **0K-25C — Outbound Delivery Contract & Controlled Delivery Lifecycle**.

## 0K-25C.1 — Outbound Delivery Foundation

**Architectural invariant:** **LUMI generates responses; channel delivery remains outside Core.**

`OutboundDeliveryRequest` reuses an existing `OutboundChannelResponse` and adds an opaque ORBI-local `deliveryId`, channel, conversation ID and creation timestamp. `OutboundDeliveryResult` is a bounded channel-boundary outcome: `pending`, `delivered` or `failed`. A delivery ID is neither a provider message ID nor an external conversation, user, phone or channel-message identifier; it may become a future retry/deduplication anchor without changing Core.

`ChannelDeliveryAdapter` owns delivery after Core/LUMI has generated the neutral response. The web/widget reference adapter performs no network delivery: `delivered` means the validated, formatted response has been handed to the existing controlled HTTP response boundary. It does not claim provider acknowledgement, end-user receipt, read status or delivery to a device.

Failures are controlled through bounded delivery codes. There are no provider payloads, provider receipts, Meta imports, retries, attempt counters, queues, workers, database or persistence. Future 0K-26 mapping is conceptual only: `OutboundDeliveryRequest → WhatsAppDeliveryAdapter → provider send boundary → OutboundDeliveryResult`; no WhatsApp adapter or API exists in this repository.

## 0K-25C.2 — Controlled Delivery Lifecycle

The local lifecycle is `NEW → pending → delivered` or `NEW → pending → failed`. `delivered` and `failed` are terminal: neither can transition backward or into the other. A future retry must use a separate controlled attempt rather than mutate a terminal delivery; retries, timers, workers and queues remain deferred.

`InMemoryDeliveryLifecycleStore` holds at most 100 process-local, ephemeral records. A record contains only delivery ID, channel, state, timestamps and a bounded error code. It never stores response text, provider payloads, identifiers, media or Core conversation data. Capacity rejects a new record without eviction; existing records remain resolvable. Exact release removes only a terminal lifecycle record and never changes Core history or correlation.

The delivery service uses a deterministic fingerprint of neutral channel, conversation and response identity to reject conflicting reuse of a `deliveryId`. An equivalent duplicate shares the original pending/terminal lifecycle and cannot execute the adapter twice. Repeated equivalent terminal completion is idempotent. Provider receipt/status integration remains a future adapter-side concern.

## 0K-25C.3 — Delivery Lifecycle Integration Review

The canonical web flow remains: compatible local HTTP route → `ControlledChannelRouter` → web adapter → normalized inbound message → correlation → Core/LUMI → `OutboundChannelResponse` → internal delivery request → lifecycle pending → web reference delivery adapter → terminal `delivered` → compatible HTTP response. The browser supplies neither a delivery ID nor lifecycle/correlation infrastructure fields; existing ORBI `conversationId` continuity remains unchanged.

Correlation and delivery are separate process-local stores. Delivery failure is translated to the controlled routing boundary and does not remove correlation. Releasing a terminal delivery record affects no correlation, Core conversation or history; releasing correlation affects no delivery record. Delivery capacity is 100 records with explicit release and no eviction. A future `WhatsAppDeliveryAdapter` can replace the local reference adapter behind the same boundary without changing Core, LUMI, Knowledge or correlation contracts; its provider identifiers and receipts remain adapter-side.

## 0K-25C — CLOSED

- **C.1 — Delivery contracts + reference adapter:** neutral internal delivery request/result contracts and a local web/widget handoff proof.
- **C.2 — Controlled lifecycle + idempotency:** bounded ephemeral state, terminal-transition protection, exact release and duplicate-send prevention.
- **C.3 — Integration certification:** canonical route coverage, correlation/delivery separation, capacity verification and compatible HTTP smoke coverage.

**Architectural invariant:** **LUMI generates responses; channel delivery remains outside Core.**

0K-25C is complete and ready for the final 0K-25 closure certification. WhatsApp remains planned/unavailable; any future adapter preserves the neutral inbound, correlation and outbound delivery boundaries.

## A.3 live route integration

The existing local HTTP receiver (`POST /api/public/widget/:publicKey/message`) now validates its compatible public payload, then invokes `ControlledChannelRouter` with the web adapter. Its single canonical path is HTTP route → controlled router → web adapter → normalized contract → bridge → existing Core/LUMI → normalized response → web adapter → compatible HTTP response.

The route translates only bounded routing failures to existing sandbox error responses; it never exposes adapter/provider internals. Widget product identity remains separate, but its current transport behavior follows this same web adapter path. Core, Knowledge Engine, LUMI, providers, conversation history and voice remain channel-independent.

## Media boundary

Future channel media → Channel/Media Adapter → canonical audio → STT → `InboundChannelMessage(messageType: "voice-transcript")` → Core/LUMI → `OutboundChannelResponse` → TTS → Media Adapter → channel media.

Raw OGG, WebM, MP3, WAV and provider media payloads remain outside the Core. This module creates no media adapter.

Real WhatsApp integration remains deferred to 0K-26.

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

## A.3 live route integration

The existing local HTTP receiver (`POST /api/public/widget/:publicKey/message`) now validates its compatible public payload, then invokes `ControlledChannelRouter` with the web adapter. Its single canonical path is HTTP route → controlled router → web adapter → normalized contract → bridge → existing Core/LUMI → normalized response → web adapter → compatible HTTP response.

The route translates only bounded routing failures to existing sandbox error responses; it never exposes adapter/provider internals. Widget product identity remains separate, but its current transport behavior follows this same web adapter path. Core, Knowledge Engine, LUMI, providers, conversation history and voice remain channel-independent.

## Media boundary

Future channel media → Channel/Media Adapter → canonical audio → STT → `InboundChannelMessage(messageType: "voice-transcript")` → Core/LUMI → `OutboundChannelResponse` → TTS → Media Adapter → channel media.

Raw OGG, WebM, MP3, WAV and provider media payloads remain outside the Core. This module creates no media adapter.

Real WhatsApp integration remains deferred to 0K-26.

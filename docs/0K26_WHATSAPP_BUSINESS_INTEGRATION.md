# 0K-26 — WhatsApp Business Integration

## 0K-26A.1: development foundation

This module establishes a **development/test-only** boundary for the official WhatsApp Business Cloud API path. It does not connect to Meta, send messages, process conversations, upload media, create webhooks publicly, or enable production behavior.

## Configuration contract

All configuration is server environment only: `WHATSAPP_ENABLED`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, and `WHATSAPP_GRAPH_API_VERSION`. No values are committed or returned by routes. `WHATSAPP_VERIFY_TOKEN` is a separate local challenge secret, not an OAuth access token.

Readiness is intentionally limited to `disabled`, `missing-config`, `ready-for-webhook`, `ready-for-api`, or `invalid-config`. Configuration never claims a live Meta connection, webhook verification, recipient permission, or production readiness.

## Webhook boundary

At the A.1 stage, `GET /api/channels/whatsapp/webhook` validated the local development verify token and `POST /api/channels/whatsapp/webhook` performed only basic envelope validation. A.2/A.3 then added the controlled signed text-inbound path documented below; it still never sends a reply or returns raw payload data.

Raw Meta-shaped data is confined to `server/src/channels/whatsapp/`. Phone numbers and `wa_id` are not ORBI identities; future correlation must use the existing channel-aware boundary.

## Adapter and deferred work

At A.1, `WhatsAppChannelAdapter` was a non-routable scaffold. It is now `inbound-foundation`: it can normalize validated text only through the controlled router/correlation path, but cannot format or deliver outbound WhatsApp messages.

No Graph API request, outbound send, templates, media, provider receipt, queue, retry, persistent store, authentication, tunnel dependency, or deployment exists here. A.2 closes the former raw-body/signature gap with a route-specific raw-body strategy while preserving global JSON parsing for all other routes.

## Manual Meta prerequisites (later test)

- Meta developer app with WhatsApp product enabled.
- Development/test phone number and permitted test recipient, if Meta makes them available.
- Local verify token, access token, phone-number ID, business-account ID, and Graph API version supplied only through environment variables.
- A public HTTPS callback URL when live Meta webhook testing begins. A.1 neither installs nor configures a tunnel.

## 0K-26A.2: controlled inbound normalization and signature boundary

The webhook route now preserves raw bytes only for `POST /api/channels/whatsapp/webhook`, before the global JSON parser. `WHATSAPP_APP_SECRET` is a third, env-only secret: it is separate from the verification token and the future access token. The route validates `x-hub-signature-256` as an HMAC SHA-256 over those exact bytes with a timing-safe comparison, then parses JSON. A missing app secret means signature verification is unavailable; the route does not pretend that the traffic is verified.

Only inbound text is normalized. Status events and unsupported media are acknowledged but never enter Core. The WhatsApp adapter creates a bounded `InboundChannelMessage` using `externalUserId`, `externalMessageId`, and a channel-scoped external conversation key (`whatsapp:<sender>`). These remain external correlation inputs only; none becomes an ORBI user or conversation identity, and raw Meta data is discarded at the boundary.

Validated text may use the existing controlled router, correlation, and Core path in inbound-only development mode. This produces a neutral response for internal validation but deliberately stops before formatting or delivery: there is still no Graph API request, outbound WhatsApp message, provider receipt mapping, queue, retry, database, or persistent storage.

Inbound duplicate prevention is process-local and bounded to 100 provider message IDs. A duplicate is acknowledged without invoking Core again. It is intentionally ephemeral and does not alter correlation or conversation lifecycle.

WhatsApp is an `inbound-foundation` channel with config-dependent development readiness, not a fully available channel. Real inbound verification and real outbound messaging remain separate future work.

## 0K-26A.3: inbound integration review

The canonical text-inbound path is exactly: raw request bytes → HMAC signature validation → JSON parsing and event classification → bounded in-memory provider-message deduplication → WhatsApp adapter normalization → controlled router → existing correlation → internal ORBI conversation → Core/LUMI. Invalid or missing signatures are rejected before parsing, normalization, correlation, or Core. Malformed payloads are controlled rejects; status, unsupported media, and irrelevant events are acknowledged without entering Core.

The process-local deduplication store holds at most 100 provider message IDs, has no eviction, and prevents the same ID from executing Core twice. A different provider message ID from the same sender is a new turn and reuses the existing channel-scoped external correlation key. Different senders are isolated. `whatsapp:<external sender>` remains external correlation metadata only, never an ORBI user ID, internal conversation ID, or tenant ID; future authentication/identity belongs in a separate layer.

Webhook acknowledgement is independent of future delivery. Internal test processing produces a neutral response but returns neither that response nor a Meta-delivery claim to the webhook caller. No Graph API send, outbound delivery result, receipt mapping, media, template, retry, queue, persistence, or database exists.

Manual configuration requirements are deliberately separated: GET verification needs `WHATSAPP_ENABLED` and `WHATSAPP_VERIFY_TOKEN`; signed POST reception also needs `WHATSAPP_APP_SECRET`; current text outbound needs `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `WHATSAPP_GRAPH_API_VERSION`. `WHATSAPP_BUSINESS_ACCOUNT_ID` remains optional future/admin metadata. Static local QA passes. A real Meta test remains blocked until a public HTTPS callback and real development credentials are intentionally supplied; no tunnel is installed by this project.

## 0K-26A: CLOSED

- **A.1:** env-only configuration and webhook verification foundation.
- **A.2:** route-local raw-body signature validation and text-only normalization.
- **A.3:** signed inbound text integration through deduplication, adapter normalization, correlation, and the existing Core/LUMI path.

The completed scope is text inbound only. There is no outbound Meta send, media support, real Meta test, or full channel availability. The process-local deduplication capacity is 100 provider message IDs, with no eviction or persistence. The operational gap for a real Meta test remains a deliberately supplied public HTTPS callback and real development configuration. `whatsapp:<external sender>` remains an external correlation boundary only.

**0K-26A is CLOSED.** WhatsApp remains `inbound-foundation`, configuration-dependent, and not fully available because real outbound sending is not implemented. **Next: 0K-26B — WhatsApp Outbound Text Delivery.**

## 0K-26B.1: Meta Graph outbound text client foundation

This module adds a text-only, provider-boundary client foundation; it does **not** send a real message. Outbound readiness is evaluated separately as `disabled`, `missing-config`, `ready-for-outbound`, or `invalid-config` from the existing environment-only access token, phone-number ID, business-account ID, and Graph API version. Being configured does not claim a successful connection or a fully available WhatsApp channel.

`WhatsAppGraphClient` alone constructs the official messages endpoint from validated configuration, creates the provider-specific text payload, and adds the authorization header. The recipient is supplied only through a WhatsApp-specific delivery context and never enters `OutboundChannelResponse`, Core, LUMI, knowledge, or internal identity. The native transport is bounded and exists for a later explicitly authorized live test; B.1 QA injects deterministic fake transports only.

Provider success is normalized to an accepted boundary result. A provider message ID, if returned, stays provider-local. Authentication, rejection, rate-limit, timeout, network, and invalid-response failures are normalized without raw provider payloads, tokens, recipients, URLs, or stacks. `WhatsAppDeliveryAdapter` reuses the existing neutral `ChannelDeliveryAdapter` and `ChannelDeliveryService` lifecycle, preserving the ORBI delivery ID. `delivered` means provider API acceptance/handoff only, never end-user read. There are no retries, templates, media, or live Meta sends.

**Next B.2 goal:** controlled outbound integration review and an explicitly authorized live-test gate; full WhatsApp availability remains unavailable until a real end-to-end Meta test is approved and succeeds.

## 0K-26B.2: controlled outbound integration review

The signed text webhook can be composed with an explicitly injected WhatsApp delivery adapter for local deterministic QA. The normal webhook composition remains ACK-only and does not create a Graph client send. During the controlled loop, the inbound sender is retained only inside the WhatsApp delivery-adapter composition; Core, LUMI, neutral responses, correlation identity, and webhook acknowledgements remain recipient-unaware.

The existing delivery lifecycle creates a pending record and records `delivered` only when the provider accepts the send request. This is provider acceptance, not handset delivery, read, or receipt state. Duplicate inbound provider IDs are acknowledged without a second Core execution or outbound send. Adapter failures terminally fail only the delivery record; they do not reprocess Core and retries remain deferred. Sender-specific correlation and recipient context are isolated per inbound event.

All B.2 QA uses injected fake transport. `LIVE_META_SEND: NOT_RUN`. WhatsApp remains `TEXT_PIPELINE_FOUNDATION_COMPLETE`, `CONFIG_DEPENDENT`, and not fully available until a separately authorized real Meta inbound/outbound test.

## 0K-26B.3: local certification and live-test readiness

The canonical local text loop is certified with signed fixtures and injected fake Graph transport: webhook raw-body signature verification → classification → inbound deduplication → WhatsApp adapter normalization → correlation → Core/LUMI → neutral outbound response → existing delivery lifecycle → WhatsApp delivery adapter → fake provider acceptance. It has one inbound path, one recipient-context path at the WhatsApp boundary, one correlation path, and one delivery lifecycle. There is no bypass around signature verification, deduplication, or controlled delivery.

`delivered` means that Meta accepts the outbound request, not handset receipt, user read, or a delivery-status webhook. A duplicate provider message ID is acknowledged without a second Core execution, delivery record, or fake send. A provider failure terminally marks the delivery failed without changing correlation, exposing provider data, or retrying/reprocessing Core. Sender-specific correlation, recipient context, and internal conversations remain isolated.

### Live configuration matrix

| Variable | Purpose | Required for | Secret |
| --- | --- | --- | --- |
| `WHATSAPP_ENABLED` | Explicit channel enablement | webhook and outbound runtime | No |
| `WHATSAPP_VERIFY_TOKEN` | Meta subscription challenge comparison | GET verification | Yes |
| `WHATSAPP_APP_SECRET` | HMAC signature verification | signed POST webhook | Yes |
| `WHATSAPP_ACCESS_TOKEN` | Graph authorization header | outbound text send | Yes |
| `WHATSAPP_PHONE_NUMBER_ID` | Trusted Graph messages endpoint component | outbound text send | No |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Future/admin account metadata | not required by current text endpoint | No |
| `WHATSAPP_GRAPH_API_VERSION` | Trusted Graph endpoint version component | outbound text send | No |

The Graph API version is config-driven. Before a real test, the operator must verify the currently supported version in Meta Developer; this project does not choose or hardcode a new version.

### First real development test checklist

- Meta Developer account and a Meta App with the WhatsApp product enabled.
- Development or business phone-number setup, plus a permitted test recipient when development mode requires it.
- Runtime-only access token, phone-number ID, app secret, and Graph API version; a locally chosen verify token.
- A public HTTPS callback at `https://<PUBLIC_HOST>/api/channels/whatsapp/webhook` for both GET verification and POST events, with the corresponding Meta webhook subscription configured.
- A clean, reviewed working tree; no committed secrets; harmless test text; a confirmed intended recipient; trusted config endpoint construction; active timeout; disabled retries; and redacted logs.

Public HTTPS may be an existing staging host or a temporary development tunnel. This repository does not select, install, deploy, or configure either option. A small adapter-side `WHATSAPP_TEST_RECIPIENT_ALLOWLIST` guard is **RECOMMENDED_BEFORE_LIVE_TEST** so the first live send is restricted to the explicitly confirmed test recipient; it must not become Core logic.

Native Graph transport is not called on startup, health checks, fixture QA, or normal ACK-only webhook handling. It executes only if a future explicit live composition invokes it with valid runtime configuration. `LIVE_META_SEND: NOT_RUN`.

## 0K-26B: CLOSED

- **B.1:** Meta Graph client boundary and text-only provider contract.
- **B.2:** Complete local signed inbound-to-outbound loop through the existing delivery lifecycle.
- **B.3:** Final text-pipeline certification and explicit live-test readiness requirements.

The family is closed with fake/injected transport only. No real Meta request, media, voice, queue, retry worker, persistent delivery storage, or production channel availability was introduced. The Graph version is config-driven; `WHATSAPP_BUSINESS_ACCOUNT_ID` is not required for the current message-send endpoint; public HTTPS and real development configuration remain operational prerequisites. A boundary-only test-recipient allowlist is recommended before the separately authorized live test.

**0K-26B is CLOSED. Next: 0K-26C — Controlled WhatsApp Live Text Test Preparation.**

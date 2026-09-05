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

Manual configuration requirements are deliberately separated: GET verification needs `WHATSAPP_ENABLED` and `WHATSAPP_VERIFY_TOKEN`; signed POST reception also needs `WHATSAPP_APP_SECRET`; future outbound additionally needs `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, and `WHATSAPP_GRAPH_API_VERSION`. Static local QA passes. A real Meta test remains blocked until a public HTTPS callback and real development credentials are intentionally supplied; no tunnel is installed by this project.

## 0K-26A: CLOSED

- **A.1:** env-only configuration and webhook verification foundation.
- **A.2:** route-local raw-body signature validation and text-only normalization.
- **A.3:** signed inbound text integration through deduplication, adapter normalization, correlation, and the existing Core/LUMI path.

The completed scope is text inbound only. There is no outbound Meta send, media support, real Meta test, or full channel availability. The process-local deduplication capacity is 100 provider message IDs, with no eviction or persistence. The operational gap for a real Meta test remains a deliberately supplied public HTTPS callback and real development configuration. `whatsapp:<external sender>` remains an external correlation boundary only.

**0K-26A is CLOSED.** WhatsApp remains `inbound-foundation`, configuration-dependent, and not fully available because real outbound sending is not implemented. **Next: 0K-26B — WhatsApp Outbound Text Delivery.**

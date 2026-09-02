# ORBI ChatBox IA Core — Post-MVP Roadmap

Baseline: `v0.22.0-functional-mvp`
Commit: `a9c17ab`
Status: **FUNCTIONAL MVP — CLOSED / VALIDATED**

The MVP baseline remains reproducible and untouched. Next version: TBD.

## Validated baseline

LUMI, bounded Knowledge Engine, ephemeral conversation continuity, controlled capability boundary (`knowledge-search` only), frontend runtime states, Ollama + qwen-local (`qwen3:1.7b`), and mock as default provider.

## Development principle

Every post-MVP feature must establish necessity, reuse, security/data/external effects, baseline safety, and whether it belongs now or later. Follow: Objective → Capabilities → Tools → Architecture → Implementation → Tests → Automation → Hardening → Release.

## Priorities

- **P0 — Productization essential:** controlled session persistence, safe application configuration, startup usability, staging/production-readiness planning, and future authentication security boundaries.
- **P1 — Commercial capabilities:** optional cloud providers, controlled connectors, WhatsApp, organization knowledge ingestion, and external documents.
- **P2 — Advanced evolution:** autonomous agents, complex tool calling, embeddings/vector retrieval, semantic memory, multi-agent systems, and analytics.

These are roadmap candidates only; none are implemented here.

## 0K-23 — CLOSED

## 0K-24 — ACTIVE

Current module: **0K-24A.1 — Voice I/O Contract & Runtime Boundary**.

Voice architecture: audio → STT → ORBI ChatBox Core → LUMI → TTS → audio. The contracts are provider-neutral and preserve the existing conversation, grounding, and capability boundaries. Real STT, TTS, microphone capture, audio playback, external services, and WhatsApp integration are not active.

## Next P0 roadmap

- 0K-24 — Voice Interaction Foundation
- 0K-25 — Multi-Channel Messaging Foundation
- 0K-26 — WhatsApp Business Integration
- 0K-27 — WhatsApp Voice Messages
- 0K-28 — Staging / Production Readiness

Voice target only: microphone/audio → STT → ORBI ChatBox Core → LUMI → TTS → audio playback.
WhatsApp targets only: WhatsApp inbound → channel adapter → ORBI ChatBox Core → LUMI → WhatsApp outbound; WhatsApp audio → media adapter → STT → Core → LUMI → TTS → WhatsApp audio response. Each remains subject to validation.

## Recommended next module

**0K-24A.2 — Speech-to-Text Foundation**: future adapter work only after the Voice I/O contracts are validated.

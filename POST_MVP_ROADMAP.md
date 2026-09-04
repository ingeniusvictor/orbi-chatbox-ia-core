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

## 0K-24 — CLOSED

0K-24 delivers a controlled local voice foundation: browser push-to-talk → temporary WebM → local CPU `whisper.cpp` (multilingual `base` model with a bounded ORBI vocabulary prompt) → existing ORBI ChatBox Core/LUMI conversation → local TTS → browser WAV playback. Conversation continuity, grounding and capability boundaries remain unchanged.

TTS primary is `kokoro-local` with voice `ef_dora`. Spanish text follows `Misaki` / `EspeakG2P(language="es")` → explicit phonemes → Kokoro `is_phonemes=true`. Python stdin/stdout are explicitly UTF-8. Windows SAPI with `Microsoft Helena Desktop` is a controlled local fallback. No cloud speech, API keys, persistent audio, wake word, continuous listening, WhatsApp or production endpoint is enabled.

The Chat Studio includes runtime-only assistant-audio replay, responsive voice states and the approved flagship LUMI visual experience. Human voice acceptance: **PASS**. Human visual acceptance: **PASS**. Future enhancement (non-blocking): improve LUMI voice naturalness / human likeness.

## Next P0 roadmap

- 0K-25 — Multi-Channel Messaging Foundation
- 0K-26 — WhatsApp Business Integration
- 0K-27 — WhatsApp Voice Messages
- 0K-28 — Staging / Production Readiness

Voice target only: microphone/audio → STT → ORBI ChatBox Core → LUMI → TTS → audio playback.
WhatsApp targets only: WhatsApp inbound → channel adapter → ORBI ChatBox Core → LUMI → WhatsApp outbound; WhatsApp audio → media adapter → STT → Core → LUMI → TTS → WhatsApp audio response. Each remains subject to validation.

## Recommended next module

**0K-25 — Multi-Channel Messaging Foundation**. This remains planned only; it does not implement real WhatsApp, Meta credentials, webhooks, external messaging or production deployment.

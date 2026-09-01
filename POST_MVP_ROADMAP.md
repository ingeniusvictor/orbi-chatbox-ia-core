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

## Recommended next module

**0K-23A.2 — Post-MVP Runtime Configuration Boundary**: prepare configuration structure without persistence, authentication, or external providers.

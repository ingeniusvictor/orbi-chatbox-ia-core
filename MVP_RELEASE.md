# ORBI ChatBox IA Core

## Functional MVP Release

- Version: v0.22.0-functional-mvp
- Status: FUNCTIONAL MVP — CLOSED / VALIDATED (not production)
- Date: 2026-09-01

### What is included

LUMI identity and behavior, mock and qwen-local providers, bounded Knowledge Engine with structured and legacy local sources, ephemeral conversation continuity, controlled `knowledge-search`, frontend pending/error/retry UX, and grounding metadata.

### Runtime profile

Default provider: `mock`. Validated local profile: Ollama + `qwen-local` + `qwen3:1.7b`, `think: false`, `stream: false`, suitable for a modest local development workstation. No silent fallback.

### Knowledge, conversation and capability boundaries

KnowledgeContext: maximum 3 entries / 1200 characters; grounding comes only from KnowledgeContext. Conversation is in-memory only: 8 turns / 6000 characters; provider window: 6 turns / 2500 characters; restart clears it. Only `knowledge-search` is executable. `conversation-context`, `system-status`, and `external-action` are not executable.

### Frontend

`conversationId` is runtime-only. LUMI chat, pending, retry, classified runtime states and grounding badge are enabled. Raw source IDs remain hidden. There are no provider/model selectors or persistent browser history.

### Security / scope boundaries

No production deployment, database, persistent memory, authentication, real users, WhatsApp, Gmail, Calendar, browser automation, agents, autonomous tools, external web search, Drive/Notion ingestion, embeddings, vector DB, production secrets or API keys. OpenAI, Gemini and Gemma runtimes are blocked.

### Validation and final state

Mock and qwen-local paths, LUMI, knowledge, conversation, controlled capability and frontend UX were validated end-to-end. The current Functional MVP development cycle is closed; future product work remains separate scope.

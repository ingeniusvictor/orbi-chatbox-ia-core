# 0K-31 Persistent Memory & Context
Conversation records are keyed exclusively by internal ORBI conversation ID. Memory is the safe default; file mode is selected with ORBI_CONVERSATION_MEMORY_MODE=file and ORBI_CONVERSATION_MEMORY_FILE (default .orbi-data/conversations.json).

The file envelope is version 1 and uses serialized temporary-file replacement so the canonical snapshot is not intentionally truncated before a replacement is ready. Corrupt or structurally invalid JSON produces a controlled error and is not overwritten. Completed user/assistant exchanges are appended only after a successful Core response; handoff suppression and provider failure append nothing. The bridge receives memory by dependency injection after correlation, then projects bounded prior turns into provider conversation context separately from Knowledge Context.

This is process-local durable storage, not horizontal-scale or multi-process production storage. Runtime data is ignored by Git.

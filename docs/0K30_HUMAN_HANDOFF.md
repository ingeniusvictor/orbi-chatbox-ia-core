# 0K-30 Human Handoff Foundation

Internal conversation IDs alone key the bounded in-memory service. States are `AI_ACTIVE`, `HANDOFF_REQUESTED`, and `HUMAN_ACTIVE`; requested and active states suppress new AI execution before Core. Transitions are recorded in bounded neutral history without PII. Chatwoot is not required; a future operator-console label may map into this neutral service. Horizontal scale requires persistent/shared state.

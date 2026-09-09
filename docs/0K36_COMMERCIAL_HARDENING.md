# 0K-36 Commercial Runtime Hardening
Commercial policy validates inbound limits, bounded per-conversation rate limiting and safe configuration fingerprinting. Runtime controls use internal conversation IDs only. This is single-process hardening; external shared rate limiting, WhatsApp and staging remain pending.

RuntimeReadinessReport consumes sanitized structural validator findings without network probes. Mandatory component failures produce NOT_READY; absent optional telemetry produces DEGRADED; a fully composed runtime produces READY. Reports expose only bounded component status, safe code and safe message fields.

## Runtime failure semantics

Execution outcomes use four neutral, non-overlapping categories:

- `FAIL_CLOSED`: invalid or unsafe structural configuration. Reasons: `INVALID_CLIENT_PROFILE`, `UNKNOWN_CONFIGURED_TOOL`, `INVALID_COMMERCIAL_POLICY`, `INVALID_RUNTIME_COMPOSITION`.
- `CONTROLLED_DENIAL`: a healthy runtime intentionally denies one execution. Reasons: `CHANNEL_DISABLED`, `INPUT_TOO_LARGE`, `HANDOFF_ACTIVE`, `RATE_LIMITED`, `CONCURRENCY_LIMITED`.
- `BEST_EFFORT_FAILURE`: an optional supporting operation failed without automatically failing the primary execution. Reason: `TELEMETRY_FAILURE`.
- `RUNTIME_ERROR`: execution was allowed but Core, a provider, or a tool failed. Reasons: `PROVIDER_FAILURE`, `TOOL_EXECUTION_FAILURE`, `CORE_EXECUTION_FAILURE`.

Readiness (`READY`, `DEGRADED`, `NOT_READY`) describes structural runtime composition; these execution categories describe an individual runtime outcome. They are deliberately separate. Normalized dispositions contain only category, bounded reason code and bounded safe message. They never carry raw messages, prompts, identities, contact data, credentials, tool arguments or business records.

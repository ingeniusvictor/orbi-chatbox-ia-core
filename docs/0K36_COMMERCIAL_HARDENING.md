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

## Runtime integration order

The neutral channel path now resolves the internal ORBI conversation identity before applying the active client channel policy, Unicode code-point input guard, human-handoff guard, fixed-window rate limit and per-conversation execution coordinator. Memory/context selection and Core/provider/tool execution begin only after every controlled guard passes; delivery remains after a successful neutral response.

Controlled denials create no fabricated completed memory turn. Provider failures also complete no successful assistant turn, while normal, tool-assisted and burst-composed inputs each remain one logical completed turn. Rate limiting and coordination are process-local and keyed only by the internal conversation ID. The runtime resolves one active client profile and is not a concurrent multi-tenant composition.

Controlled-denial telemetry is metadata-only (`runtimeDisposition`, reason code, profile ID, non-secret configuration fingerprint and timestamp). It never contains message text or external identity, and telemetry sink failure remains best-effort without changing the primary outcome. WhatsApp 0K-26D remains paused.

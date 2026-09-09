# 0K-29 Messaging UX Foundation

Independent TypeScript primitives, conceptually inspired by the Basdonax burst-buffer pattern at commit `713ddf36ab65a4ca2afdf64e05b61763ad3bab6e`; no code was copied. Buffering is opt-in, ephemeral, bounded, and keyed only by internal ORBI conversation ID. Splitting happens after Core produces one neutral response; activity is optional best-effort. No LangGraph or Chatwoot was adopted. Horizontal scale will need shared coordination.

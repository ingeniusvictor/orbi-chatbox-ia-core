# Controlled Preview Execution Inputs

> **Estado:** INPUT TEMPLATE / NO EXECUTION / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Registrar los inputs obligatorios antes de ejecutar una futura prueba preview controlada de ORBI ChatBox Installable Widget Suite en la web ORBI. Este documento no ejecuta preview, no autoriza deploy, no modifica la web ORBI y no habilita producción.

## Decisión actual

- Local MVP: READY.
- Installable Widget Suite: SANDBOX READY.
- Execution Gate: READY.
- Execution inputs: PENDING.
- Controlled preview execution: NO-GO hasta completar inputs.
- Production: NO-GO.

## Tabla de inputs requeridos

| Input | Required | Current value | Status | Notes |
| --- | --- | --- | --- | --- |
| Commit SHA | Yes | `cb52e3f2f1fb247d18f12c7528c54946c96af3e8` | READY | Referencia inicial; confirmar SHA final antes de ejecutar. |
| ORBI web preview URL | Yes | PENDING | PENDING | Debe ser no productiva y reversible. |
| Controlled backend URL | Yes | PENDING | PENDING | No localhost para preview público. |
| Backend health endpoint | Yes | PENDING | PENDING | Debe responder en sandbox. |
| CORS allowlist | Yes | PENDING | PENDING | Solo dominio preview; sin wildcard. |
| Preview public key | Yes | PENDING | PENDING | No secreta y revocable. |
| ORBI preview clientId | Yes | `orbi-preview` | DRAFT | Placeholder seguro. |
| ORBI preview mode | Yes | `preview` | DRAFT | No habilita producción. |
| Web chat enabled | Yes | `true` | DRAFT | Canal sandbox. |
| WhatsApp enabled | Yes | `true` | DRAFT | Solo manual. |
| WhatsApp phone number | Yes | EMPTY / PENDING AUTHORIZATION | PENDING | Sin enlace hasta autorización explícita. |
| Voice enabled | Yes | `false` | READY | Voz permanece diferida. |
| realDataAllowed | Yes | `false` | READY | No se permiten datos reales. |
| productionAllowed | Yes | `false` | READY | Producción bloqueada. |
| externalAiAllowed | Yes | `false` | READY | IA externa bloqueada. |
| whatsappAutomationAllowed | Yes | `false` | READY | Automatización bloqueada. |
| databasePersistenceAllowed | Yes | `false` | READY | Persistencia real bloqueada. |
| Technical owner | Yes | PENDING | PENDING | Designar antes de ejecutar. |
| Web owner | Yes | PENDING | PENDING | Designar antes de ejecutar. |
| Rollback owner | Yes | PENDING | PENDING | Designar antes de ejecutar. |
| Rollback procedure | Yes | PENDING | PENDING | Debe revisarse y probarse/prepararse. |
| Victor explicit approval | Yes | PENDING | PENDING | Requisito final para ejecución. |

## Validation evidence inputs

- [ ] `npm run lint` PASS
- [ ] `npm run build` PASS
- [ ] `npm run server:check` PASS
- [ ] `npm run server:qa` PASS
- [ ] Web Widget Workspace screenshot captured
- [ ] Unified Floating Launcher screenshot captured
- [ ] Installable Client Config screenshot captured
- [ ] Backend health screenshot or log captured
- [ ] CORS rejection test captured
- [ ] Rollback evidence captured

## ORBI preview configuration draft — CONCEPTUAL ONLY

No pegar en producción. No contiene secretos y no habilita IA externa, WhatsApp bot ni datos reales.

```js
window.ORBI_WIDGET_CONFIG = {
  clientId: "orbi-preview",
  mode: "preview",
  brandName: "ORBI Ecosystem",
  assistantName: "ORBI Assistant",
  enabledChannels: { webChat: true, whatsapp: true, voice: false },
  chatbox: {
    receiverUrl: "PENDING_CONTROLLED_BACKEND_URL",
    publicKey: "PENDING_PREVIEW_PUBLIC_KEY",
    realDataAllowed: false
  },
  whatsapp: {
    enabled: true,
    mode: "manual",
    phoneNumber: "",
    defaultMessage: "Hola ORBI Ecosystem. Vengo desde la web y necesito información.",
    automationAllowed: false
  },
  guardrails: {
    productionAllowed: false,
    realCustomerDataAllowed: false,
    externalAiAllowed: false,
    whatsappAutomationAllowed: false,
    databasePersistenceAllowed: false
  }
};
```

## Input decision rules

**GO** para ejecución preview solo si todos los inputs están completos, no hay `PENDING` críticos, los guardrails siguen en `false`, QA pasa, rollback está preparado y Víctor autoriza explícitamente.

**CONDITIONAL GO** solo para completar inputs si faltan URL preview, backend, CORS o public key; no permite ejecutar preview, tocar Web ORBI ni usar datos reales.

**NO-GO** si se intenta producción, `main` sin preview, datos reales, WhatsApp bot, IA externa, si no hay rollback o aprobación explícita.

## Estado recomendado actual

**CONDITIONAL GO** para completar inputs. **NO-GO** para ejecutar preview real.

La suite sandbox y el gate están listos, pero faltan URL preview, backend controlado, CORS, public key, responsables, rollback y aprobación explícita.

Antes de completar ejecución real, realizar el ensayo según [Controlled Preview Dry Run Plan](./CONTROLLED_PREVIEW_DRY_RUN_PLAN.md).

## Próxima fase recomendada

`0K-15A.3 — Controlled Preview Dry Run Plan`

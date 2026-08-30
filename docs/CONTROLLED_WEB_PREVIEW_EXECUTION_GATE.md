# Controlled Web Preview Execution Gate

> **Estado:** EXECUTION GATE / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Evaluar si ORBI ChatBox Installable Widget Suite puede avanzar hacia una prueba preview controlada en la web ORBI. Este documento no ejecuta preview, no autoriza deploy, no modifica la web ORBI y no habilita producción.

## Decisión actual

- Local MVP: READY.
- Installable Widget Suite: SANDBOX READY.
- ORBI Website Preview Package: READY.
- Controlled preview execution: NO-GO actualmente.
- Production: NO-GO.

## Qué está listo

- Chat Studio backend sandbox.
- Web Widget backend sandbox.
- Sandbox lead capture y Lead Intelligence.
- Receiver QA Matrix.
- WhatsApp Floating Widget internal sandbox.
- Unified Floating Launcher sandbox.
- Installable Client Config Template.
- ORBI Website Preview Package.
- Guardrails de datos y producción.

## Qué falta para ejecutar preview real

1. URL preview de la web ORBI.
2. Backend controlado público/no productivo.
3. CORS allowlist para dominio preview.
4. Public key preview.
5. Configuración ORBI preview final.
6. Responsable técnico.
7. Responsable web.
8. Rollback probado o preparado.
9. Autorización explícita de Víctor.
10. Evidencia visual final.

## Bloqueadores actuales

- No hay URL preview confirmada.
- No hay backend controlado público/no productivo confirmado.
- No hay CORS preview confirmado.
- No hay public key preview confirmada.
- No hay autorización final para ejecutar preview.
- No se debe usar producción.

## GO criteria

GO solo si todos los pendientes están resueltos, estas validaciones pasan — `npm run lint`, `npm run build`, `npm run server:check`, `npm run server:qa` — y se cumplen los siguientes puntos:

- Existe preview no productivo y backend controlado.
- CORS permite solo el dominio preview.
- Public key preview es revocable y no secreta.
- La configuración ORBI preview conserva `realDataAllowed=false`, `productionAllowed=false`, `whatsappAutomationAllowed=false`, `externalAiAllowed=false` y `databasePersistenceAllowed=false`.
- Rollback está definido.
- Víctor autoriza explícitamente.

## CONDITIONAL GO criteria

CONDITIONAL GO solo para preparación si el MVP local y la suite sandbox funcionan, existe ORBI Website Preview Package y aún faltan configuraciones no productivas. No permite ejecutar preview real, tocar Web ORBI, usar producción ni datos reales.

## NO-GO criteria

NO-GO si se intenta tocar `main` productivo, instalar en Web ORBI sin preview, desplegar sin backend controlado, usar datos reales, activar WhatsApp bot o IA externa, falta rollback, fallan validaciones o no hay autorización explícita.

## Evidencia requerida antes de ejecutar

- Commit SHA actual.
- Resultado de lint, build, server:check y server:qa.
- Captura Web Widget Workspace con Unified Launcher.
- Captura de configuración sandbox.
- URL preview, backend URL controlado, CORS allowlist y public key preview.
- Responsable técnico, responsable web y rollback.
- Aprobación explícita de Víctor.

## Decisión recomendada actual

**CONDITIONAL GO** para seguir preparando ejecución. **NO-GO** para ejecutar preview real en este momento.

La suite sandbox está lista, pero faltan URL preview, backend controlado público/no productivo, CORS, public key preview y autorización final.

Los valores concretos deben completarse en [Controlled Preview Execution Inputs](./CONTROLLED_PREVIEW_EXECUTION_INPUTS.md).

## Próxima fase recomendada

`0K-15A.2 — Controlled Preview Execution Inputs`

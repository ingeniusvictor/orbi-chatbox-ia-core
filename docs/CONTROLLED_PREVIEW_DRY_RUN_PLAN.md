# Controlled Preview Dry Run Plan

> **Estado:** DRY RUN PLAN / NO EXECUTION / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Definir un ensayo controlado previo a una futura prueba preview de ORBI ChatBox Installable Widget Suite en la web ORBI. Este documento no ejecuta preview, no autoriza deploy, no modifica la web ORBI y no habilita producción.

## Decisión actual

- Local MVP: READY.
- Installable Widget Suite: SANDBOX READY.
- Execution Gate: READY.
- Execution Inputs Template: READY.
- Dry run plan: READY AFTER THIS MODULE.
- Controlled preview execution: NO-GO hasta completar inputs.
- Production: NO-GO.

## Qué se simula en el dry run

El dry run debe simular localmente:

1. Apertura del Web Widget Workspace.
2. Visualización del Unified Floating Launcher.
3. Canal Chat IA en modo sandbox.
4. Canal WhatsApp manual en modo configuración.
5. Voz desactivada.
6. Lectura de Installable Client Config y confirmación de guardrails `false`.
7. Backend health local y Receiver QA Matrix.
8. Lead sandbox creado desde Chat Studio o Web Widget.

## Qué NO se ejecuta

- Web ORBI real ni preview Vercel real.
- Deploy, snippet/loader real o producción.
- WhatsApp Business API, webhook o automatización.
- IA externa, base de datos real, datos reales o voz real.

## Pasos del dry run local

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Ejecutar `npm run server:check`.
4. Ejecutar `npm run server:qa`.
5. Levantar backend local con `npm run server:dev`.
6. Levantar frontend local con `npm run dev`.
7. Abrir `http://localhost:3000`.
8. Ir a Web Widget Workspace y confirmar Unified Floating Launcher visible.
9. Abrir launcher; confirmar Chat IA visible, WhatsApp manual/configuración y voz desactivada.
10. Confirmar Installable Client Config visible.
11. Enviar mensaje sandbox desde Web Widget o Chat Studio.
12. Confirmar respuesta backend sandbox y lead sandbox en Lead Intelligence.
13. Confirmar que no se abrió WhatsApp externo, no hay datos reales y no hay errores críticos en consola.

## Evidencia requerida

- Resultados de lint, build, server:check y server:qa.
- Captura backend health local.
- Capturas del launcher cerrado y abierto, Chat IA, WhatsApp en configuración e Installable Client Config.
- Captura de respuesta backend sandbox y Lead Intelligence con lead sandbox.
- Captura de consola sin errores críticos.
- Nota de que WhatsApp externo no se abrió y no se usaron datos reales.

## Errores bloqueantes

No avanzar a preview real si falla cualquiera de las validaciones, no carga Web Widget Workspace, no aparece Unified Floating Launcher, WhatsApp abre enlace externo sin número autorizado, voz aparece activa, algún guardrail aparece `true`, no se crea lead sandbox, hay errores críticos o se usan datos reales.

## Resultado esperado

El dry run es PASS solo si validaciones pasan, launcher y canales aparecen correctamente, Chat IA permanece sandbox, WhatsApp manual/configuración, voz desactivada, guardrails seguros, backend sandbox responde, lead sandbox se crea y no hay datos reales ni producción.

## Decisión después del dry run

- **PASS:** se puede pasar a completar inputs reales de preview.
- **CONDITIONAL PASS:** se puede corregir evidencia o texto menor.
- **FAIL:** no avanzar a preview real.

## Estado recomendado actual

**CONDITIONAL GO** para preparar dry run. **NO-GO** para ejecutar preview real.

## Próxima fase recomendada

`0K-15A.4 — Controlled Preview Dry Run Evidence Template`

# Controlled Preview Readiness Gate

> **Estado:** READINESS GATE / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Definir la compuerta mínima para decidir si ORBI ChatBox IA Core puede pasar a una prueba controlada en ambiente *preview* de la web ORBI. Esta compuerta documenta evidencia y decisiones; no autoriza despliegue, integración productiva ni cambios en Web ORBI.

## Alcance

Esta compuerta evalúa solo una prueba controlada, no producción.

Incluye:

- Web Widget sandbox.
- Backend receiver controlado.
- Lead sandbox.
- QA local.
- Guardrails de datos.

No incluye:

- Producción.
- WhatsApp real.
- IA externa.
- Base de datos real.
- Voz.
- SLA.
- Clientes reales.

## Estado actual del proyecto

### READY

- Frontend premium demo.
- Chat Studio backend sandbox.
- Web Widget backend sandbox.
- Sandbox lead capture.
- Lead Intelligence.
- Receiver QA Matrix.
- Controlled Embed Plan.
- Controlled Embed Instruction Pack.

### BLOCKED

- Endpoint público productivo.
- Web production embed.
- Datos reales.
- WhatsApp real.
- IA externa.
- Base de datos real.
- Voz.

## Evidencia mínima requerida

Antes de considerar cualquier *preview* controlado debe existir evidencia de:

1. `npm run lint`: PASS.
2. `npm run build`: PASS.
3. `npm run server:check`: PASS.
4. `npm run server:qa`: PASS.
5. Chat Studio backend sandbox: PASS visual.
6. Web Widget backend sandbox: PASS visual.
7. Lead sandbox visible en Lead Intelligence: PASS visual.
8. Dominio preview definido.
9. Backend controlado definido.
10. CORS allowlist definida.
11. Public key preview definida.
12. Política de datos demo definida.
13. Rollback definido.
14. Responsable de prueba definido.
15. Confirmación explícita de no usar datos reales.

## Decisión GO

GO solo si:

- Todas las validaciones técnicas pasan.
- Existe dominio preview.
- Existe backend controlado.
- CORS está definido.
- Public key preview está definida.
- Solo se usarán datos sintéticos.
- Existe rollback.
- Víctor autoriza explícitamente la prueba.

## Decisión CONDITIONAL GO

CONDITIONAL GO si:

- El MVP local funciona.
- QA local pasa.
- Falta solo un dato de configuración no productivo, por ejemplo dominio preview o public key.
- No se usará producción.
- No se usarán datos reales.

## Decisión NO-GO

NO-GO si:

- Se quiere probar directamente en producción.
- No hay backend controlado.
- No hay CORS definido.
- Se necesitan datos reales.
- Se necesita WhatsApp real.
- Se necesita IA externa.
- No hay rollback.
- Hay errores críticos en lint, build, server:check o server:qa.
- El Web Widget no registra lead sandbox.

## Riesgos principales

- Confundir sandbox con producción.
- Pegar un snippet conceptual en producción.
- Usar localhost desde una web pública.
- Exponer una URL o clave incorrecta.
- Capturar datos reales sin política.
- Prometer atención automática real antes de tiempo.

## Mitigaciones

- Mantener banner o nota de sandbox.
- Usar solo preview.
- Usar solo datos sintéticos.
- Ejecutar QA antes de la prueba.
- Confirmar rollback.
- No publicar snippet sin autorización explícita.

## Estado recomendado actual

**CONDITIONAL GO** para preparar una futura prueba preview, pero **NO-GO** para producción.

El MVP local está funcional, pero aún faltan ambiente preview, backend controlado no productivo, CORS preview y public key preview.

## Próxima fase recomendada

Los requisitos concretos y sus estados iniciales están en [Preview Environment Requirements Pack](./PREVIEW_ENVIRONMENT_REQUIREMENTS_PACK.md).

La arquitectura futura de los canales instalables está documentada en [Installable Widget Suite Architecture](./INSTALLABLE_WIDGET_SUITE_ARCHITECTURE.md); no cambia la decisión NO-GO para producción.

El [ORBI Website Preview Package](./ORBI_WEBSITE_PREVIEW_PACKAGE.md) debe existir como evidencia previa antes de cualquier decisión GO para una prueba ORBI.

La evaluación específica de ejecución está en [Controlled Web Preview Execution Gate](./CONTROLLED_WEB_PREVIEW_EXECUTION_GATE.md).

# Web ORBI Embed Controlled Plan

## Estado actual

- Chat Studio backend sandbox: READY
- Web Widget backend sandbox: READY
- Sandbox lead capture: READY
- Lead Intelligence visibility: READY
- Receiver QA Matrix: READY
- Production embed: BLOCKED
- Real customer data: BLOCKED
- WhatsApp real: BLOCKED
- External AI: BLOCKED
- Real database: BLOCKED

## Objetivo

Preparar una futura integración del widget ORBI en una web controlada sin habilitar producción todavía.

## Flujo sandbox actual

Web Widget → backend receiver local → validation hardening → sandbox lead capture → Lead Intelligence.

## Qué no está listo todavía

- No hay endpoint público productivo, dominio backend público ni CORS final de producción.
- No hay base de datos, autenticación, multiempresa ni política final para datos reales.
- No hay WhatsApp, IA externa ni voz.

## Condiciones mínimas antes de probar en una web real controlada

1. Definir ambiente preview/controlado, dominio permitido y URL de backend controlado.
2. Definir public key no secreta y CORS allowlist.
3. Definir política de datos demo y confirmar que no se usan datos reales.
4. Ejecutar QA local y pruebas visuales de Chat Studio y Web Widget.
5. Confirmar rollback manual antes de insertar cualquier snippet.

## Comandos de validación

```bash
npm run lint
npm run build
npm run server:check
npm run server:qa
```

## Instrucciones futuras para Simon / Web ORBI

Este plan es informativo: no pegar todavía en producción. Cuando se autorice una prueba controlada, usar un ambiente preview y sólo textos de prueba; verificar backend, CORS, HTTP 200 y el lead sandbox. No usar formularios ni clientes reales. Si falla, retirar el snippet.

## Guardrails

- No producción, datos reales, WhatsApp, IA externa ni base de datos real.
- No prometer SLA ni atención automática productiva.

## Próxima fase recomendada

El procedimiento de preparación, preflight, snippet conceptual y rollback está documentado en [Controlled Embed Instruction Pack](./CONTROLLED_EMBED_INSTRUCTION_PACK.md).

El paquete es **DOCUMENTATION ONLY / PRODUCTION BLOCKED**. No habilita una integración, endpoint ni despliegue productivo.

Una prueba de preview únicamente podrá evaluarse con autorización explícita, dominio permitido, CORS controlado y datos sintéticos.

La decisión formal debe pasar por el [Controlled Preview Readiness Gate](./CONTROLLED_PREVIEW_READINESS_GATE.md) antes de autorizar cualquier prueba controlada.

# WhatsApp Floating Widget Internal Module

> **Estado:** INTERNAL MODULE / MANUAL SANDBOX ONLY / PRODUCTION BLOCKED

## Propósito

Documentar el módulo interno del widget flotante de WhatsApp dentro de ORBI ChatBox IA Core.

## Alcance

Incluye un componente visual interno, apertura manual futura mediante `wa.me`, mensaje prellenado, estado de configuración, preview sandbox interno y compatibilidad futura con Unified Floating Launcher.

No incluye WhatsApp Business API, webhook, bot real, automatización, envío desde backend, datos reales ni producción.

## Comportamiento actual

- Si no hay número configurado, muestra **WhatsApp en configuración**.
- Si hay un número válido configurado en un uso futuro, prepara un enlace `wa.me` manual con mensaje prellenado.
- Informa que la atención es manual.
- No ejecuta automatización ni persiste datos.
- No llama backend ni IA externa.
- El preview de Web Widget usa teléfono vacío, por lo que no genera enlace externo.

## Guardrails

- No hardcodear números personales.
- No usar datos reales en sandbox.
- No prometer bot de WhatsApp.
- No usar como canal productivo sin GO.
- No exponer secretos.
- No usar wildcard ni configuraciones externas.

El módulo puede integrarse desde [Unified Floating Launcher Sandbox](./UNIFIED_FLOATING_LAUNCHER_SANDBOX.md), manteniendo modo manual y sin automatización.

## Próxima fase

`0K-14D.3 — Unified Floating Launcher Sandbox`

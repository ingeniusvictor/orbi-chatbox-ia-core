# Unified Floating Launcher Sandbox

> **Estado:** LAUNCHER SANDBOX / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Documentar el launcher unificado de la suite instalable ORBI ChatBox IA Core. Agrupa las entradas flotantes principales: ChatBox Web Widget, WhatsApp Floating Widget manual y voz futura.

## Alcance

Incluye componente visual interno, hub de canales, Chat IA como canal sandbox, WhatsApp manual como canal sandbox, voz marcada como futura y preview interno en Web Widget Workspace.

No incluye instalación en Web ORBI, snippet real, producción, WhatsApp Business API, webhook, IA externa, datos reales ni voz real.

## Comportamiento actual

- Muestra una entrada ORBI unificada y canales disponibles.
- Chat IA queda señalado como sandbox.
- WhatsApp queda manual/configurable y no abre sin número válido.
- Voz queda deshabilitada por defecto y solo se muestra como futura si se habilita explícitamente.
- No llama backend por sí solo, no persiste datos ni automatiza mensajes.

## Guardrails

- No usar datos reales ni teléfono real hardcodeado.
- No activar producción, voz real ni WhatsApp bot.
- No exponer secretos, usar wildcard CORS ni depender de localhost para preview público.

## Próxima fase

`0K-14D.4 — Installable Client Config Template`

# Installable Client Config Template

> **Estado:** CLIENT CONFIG TEMPLATE / SANDBOX ONLY / PRODUCTION BLOCKED

## Propósito

Documentar la plantilla de configuración por cliente para ORBI ChatBox Installable Widget Suite.

## Alcance

Incluye identidad del cliente, branding, canales habilitados, ChatBox receiver URL, public key, WhatsApp manual, voz futura, guardrails por ambiente, configuración demo ORBI y template preview para clientes.

No incluye snippet real, instalación en Web ORBI, producción, WhatsApp Business API, webhook, IA externa, base de datos real ni datos reales.

## Configuración demo ORBI

`orbiDemoInstallableWidgetConfig` es la configuración usada por el preview interno:

- Modo `sandbox`.
- `webChat: true`, `whatsapp: true`, `voice: false`.
- `realDataAllowed: false`.
- Teléfono vacío.
- `productionAllowed: false`.

## Template preview cliente

`clientPreviewTemplateConfig` ofrece placeholders seguros para una futura configuración preview:

- Modo `preview`.
- Sin secretos ni teléfono real.
- Sin datos reales, automatización ni producción.
- Backend URL y public key de ejemplo no utilizables en producción.

## Guardrails

- `productionAllowed` debe ser `false` salvo autorización futura.
- `realCustomerDataAllowed` debe ser `false` en sandbox/preview.
- `externalAiAllowed` debe ser `false` hasta módulo 0K-17.
- `whatsappAutomationAllowed` debe ser `false` hasta módulo 0K-16 o superior.
- `databasePersistenceAllowed` debe ser `false` hasta un módulo futuro de persistencia real.
- No hardcodear teléfonos reales, exponer secretos ni usar wildcard CORS.

La configuración ORBI preview debe derivarse de `orbiDemoInstallableWidgetConfig` y mantener `realDataAllowed: false` y `productionAllowed: false`. Ver [ORBI Website Preview Package](./ORBI_WEBSITE_PREVIEW_PACKAGE.md).

## Próxima fase

`0K-14D.5 — ORBI Website Preview Package`

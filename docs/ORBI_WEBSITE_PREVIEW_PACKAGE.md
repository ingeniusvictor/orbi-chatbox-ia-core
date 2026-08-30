# ORBI Website Preview Package

> **Estado:** PREVIEW PACKAGE / NO INSTALL / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Preparar el paquete de requisitos e instrucciones para una futura prueba controlada de ORBI ChatBox Installable Widget Suite en la web ORBI. Este documento no autoriza instalación real, deploy, producción ni uso de datos reales.

## Decisión actual

- Local MVP: READY.
- Installable Widget Suite: SANDBOX READY.
- ORBI Website Preview: PREPARATION ONLY.
- Production: NO-GO.

## Alcance

Incluye requisitos de preview ORBI, checklist de preflight, configuración conceptual ORBI preview, instrucciones para soporte web, evidencia visual, rollback y criterios GO/NO-GO.

No incluye modificar la web ORBI, merge a su `main`, deploy en Vercel, producción, WhatsApp Business API, webhook, IA externa, datos reales ni voz real.

## Requisitos antes de la prueba

### 1. Rama o ambiente preview de la web ORBI

Debe existir un ambiente preview no productivo, identificable como prueba, reversible y con datos sintéticos. **Estado actual:** PENDING.

### 2. Backend controlado

Debe existir backend accesible desde el preview: no localhost para preview público, modo sandbox, health check disponible, CORS limitado al dominio preview, sin IA externa, WhatsApp real automatizado ni base de datos real. **Estado actual:** PENDING.

### 3. Configuración ORBI preview

Debe derivarse de `orbiDemoInstallableWidgetConfig` cuando exista el ambiente:

- `mode: "preview"`, `clientId: "orbi-preview"`, `brandName: "ORBI Ecosystem"`.
- `webChat: true`, `whatsapp: true`, `voice: false`.
- Teléfono vacío o número ORBI autorizado explícitamente para una prueba manual.
- `realDataAllowed: false` y `productionAllowed: false`.

**Estado actual:** PENDING.

### 4. Public key preview

Debe ser una public key no secreta y revocable; no puede reutilizar una clave productiva ni exponer tokens privados. **Estado actual:** PENDING.

### 5. Política de datos demo

Durante la prueba no usar nombres, teléfonos o correos reales; tampoco clientes ni datos comerciales reales, ni promesas de atención automática. El único teléfono permitido sería uno de ORBI explícitamente autorizado para prueba manual. **Estado actual:** PENDING.

## Configuración conceptual ORBI preview — NO EJECUTABLE

Este ejemplo es conceptual: no debe pegarse en producción, no contiene secretos y no habilita WhatsApp bot, IA externa ni datos reales.

```js
window.ORBI_WIDGET_CONFIG = {
  clientId: "orbi-preview",
  mode: "preview",
  brandName: "ORBI Ecosystem",
  assistantName: "ORBI Assistant",
  enabledChannels: { webChat: true, whatsapp: true, voice: false },
  chatbox: {
    receiverUrl: "https://controlled-preview-backend.example",
    publicKey: "orbi_preview_public_key",
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

## Preflight checklist

1. Commit SHA identificado.
2. `npm run lint` PASS.
3. `npm run build` PASS.
4. `npm run server:check` PASS.
5. `npm run server:qa` PASS.
6. Preview URL definida.
7. Backend URL controlada definida.
8. CORS allowlist definida.
9. Public key preview definida.
10. Config ORBI preview revisada.
11. Datos sintéticos confirmados.
12. Rollback definido.
13. Responsable técnico definido.
14. Responsable web definido.
15. Aprobación explícita de Víctor.

## Instrucciones para soporte web ORBI

Para Simon o soporte web:

- No tocar `main` productivo; trabajar solo en rama/preview autorizada.
- No pegar el snippet conceptual en producción ni configurar secretos en frontend.
- No usar datos reales, activar WhatsApp bot o IA externa.
- No hacer merge sin GO explícito.
- Guardar captura del preview y la evidencia de rollback.

## Evidencia visual requerida

- Web ORBI preview cargando correctamente.
- Launcher flotante visible.
- Canal Chat IA visible.
- Canal WhatsApp visible en modo manual/configuración.
- Voz desactivada.
- Mensaje de sandbox/no producción.
- Lead sandbox si se conecta al backend controlado.
- Consola sin errores críticos.
- Rollback ejecutado o preparado.

## Rollback

1. Retirar snippet/loader del preview.
2. Retirar dominio preview del CORS.
3. Invalidar public key preview.
4. Confirmar que el widget ya no carga.
5. Confirmar que no hay datos reales persistidos.
6. Documentar resultado.

## Decisión GO

GO solo si todo el preflight pasa, existe preview no productivo, backend controlado, CORS allowlist, public key preview, solo datos sintéticos, rollback listo y autorización explícita de Víctor.

## Decisión NO-GO

NO-GO si se intenta usar producción, falta rollback/CORS/backend controlado, se requieren datos reales, se intenta WhatsApp bot o IA externa, se instala en `main` sin preview, o falla QA/build.

## Estado recomendado actual

**PREPARATION ONLY.** Todavía **NO-GO** para ejecutar preview real: faltan URL preview, backend controlado público/no productivo, CORS preview, public key preview y aprobación final explícita.

La decisión final de ejecución debe pasar por [Controlled Web Preview Execution Gate](./CONTROLLED_WEB_PREVIEW_EXECUTION_GATE.md).

## Próxima fase

`0K-15 — Controlled Web Preview Execution`

# Installable Widget Suite Architecture

> **Estado:** ARCHITECTURE ONLY / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Definir la arquitectura de una suite instalable para incorporar ORBI ChatBox IA Core en páginas web de ORBI y futuros clientes. La suite permitiría instalar, desde una configuración controlada, dos entradas flotantes principales:

1. ChatBox Web Widget.
2. WhatsApp Floating Widget manual.

Este documento no autoriza despliegue, producción, WhatsApp real automatizado ni IA externa.

## Decisión de producto

ORBI ChatBox IA Core deja de ser solo un chatbot interno/demo y pasa a proyectarse como **ORBI ChatBox Installable Widget Suite**.

- Primera prueba futura: web ORBI.
- Uso futuro: webs de clientes.
- Instalación futura: snippet o paquete autoinstalable.
- Administración futura: configuración por cliente.
- Canales futuros: web chat, WhatsApp y voz.

## Componentes de la suite

### 1. Unified Floating Launcher

Responsabilidad:

- Mostrar una entrada flotante en la web.
- Permitir elegir entre Chat IA y WhatsApp.
- Mantener experiencia visual ORBI.
- Ser responsive y accesible.
- No bloquear navegación de la página.

**Estado actual:** PLANNED.

### 2. ChatBox Web Widget

Responsabilidad:

- Abrir conversación web.
- Enviar mensaje al backend receiver.
- Mostrar respuesta sandbox/controlada.
- Crear lead sandbox cuando corresponda.
- Futuro: crear lead real bajo autorización.

**Estado actual:** LOCAL SANDBOX READY.

### 3. WhatsApp Floating Widget

Responsabilidad:

- Abrir conversación manual por WhatsApp.
- Usar mensaje prellenado.
- Indicar que la atención es manual.
- No operar como bot hasta una fase futura.
- Futuro: integración WhatsApp Business API.

**Estado actual:** PLANNED INTERNAL MODULE.

### 4. Client Configuration

Responsabilidad:

- Definir identidad del cliente.
- Definir canales habilitados.
- Definir número de WhatsApp.
- Definir URL del backend y public key.
- Definir modo: demo, sandbox, preview o production.
- Definir si datos reales están permitidos.

**Estado actual:** PLANNED.

### 5. Install Snippet / Loader

Responsabilidad futura:

- Permitir instalación del widget en una web externa.
- Cargar configuración controlada, estilos y runtime.
- No exponer secretos.
- Mantener rollback simple.

**Estado actual:** PLANNED / NOT IMPLEMENTED.

### 6. Backend Receiver

Responsabilidad:

- Validar public key, origen y payload.
- Responder en modo sandbox.
- Futuro: enrutar a IA real, CRM o WhatsApp bajo autorización.

**Estado actual:** LOCAL SANDBOX READY.

## Modos operativos

### Demo local

Para desarrollo local, pruebas internas y datos sintéticos. **Estado:** READY.

### Sandbox local

Para validar flujo frontend/backend, lead sandbox y QA local. **Estado:** READY.

### Preview controlado

Para probar en una web preview. Requiere dominio preview, backend controlado, CORS allowlist, public key preview y datos sintéticos. **Estado:** CONDITIONAL / PENDING CONFIGURATION.

### Producción

Para clientes reales, web pública y datos reales. **Estado:** BLOCKED.

## Configuración conceptual futura

El siguiente ejemplo es conceptual, no contiene secretos y no debe usarse en producción. No habilita WhatsApp bot ni IA externa.

```js
window.ORBI_WIDGET_CONFIG = {
  clientId: "orbi-demo",
  mode: "preview",
  brandName: "ORBI Ecosystem",
  assistantName: "ORBI Assistant",
  enabledChannels: {
    webChat: true,
    whatsapp: true,
    voice: false
  },
  chatbox: {
    receiverUrl: "https://controlled-backend.example",
    publicKey: "preview_public_key",
    realDataAllowed: false
  },
  whatsapp: {
    enabled: true,
    mode: "manual",
    phoneNumber: "569XXXXXXXX",
    defaultMessage: "Hola ORBI Ecosystem. Vengo desde la web y necesito información."
  }
};
```

## Diferencia entre widgets

### ChatBox Web Widget

- Conversación dentro de la web.
- Puede generar lead sandbox.
- Futuro: IA real controlada.

### WhatsApp Floating Widget

- Redirige a WhatsApp.
- Atención manual inicialmente.
- No crea automatización real.
- Futuro: WhatsApp Business API.

### Unified Floating Launcher

- Une ambas entradas.
- Evita botones desordenados.
- Permite activar o desactivar canales por cliente.

## Instalación futura por cliente

1. Crear perfil del cliente.
2. Definir canales habilitados.
3. Configurar branding.
4. Configurar número WhatsApp.
5. Configurar backend URL.
6. Configurar public key.
7. Generar snippet.
8. Instalar en web del cliente.
9. Validar preview.
10. Autorizar producción.

## Guardrails

- No datos reales en sandbox.
- No WhatsApp real automatizado sin autorización.
- No IA externa sin autorización.
- No producción sin GO.
- No wildcard CORS.
- No secretos en frontend.
- No números personales hardcodeados.
- No dependencia de localhost en preview público.

## Roadmap recomendado

1. `0K-14D.1 — Installable Widget Suite Architecture`
2. `0K-14D.2 — WhatsApp Floating Widget Internal Module`
3. `0K-14D.3 — Unified Floating Launcher Sandbox`
4. `0K-14D.4 — Installable Client Config Template`
5. `0K-14D.5 — ORBI Website Preview Package`
6. `0K-15 — Controlled Web Preview Execution`
7. `0K-16 — Low Volume WhatsApp Manual/Business Bridge`
8. `0K-17 — Controlled Real AI Layer`
9. `0K-18 — ORBI Voice Response Layer`

## Decisión recomendada actual

La arquitectura de suite instalable está **APPROVED FOR DOCUMENTATION**. La implementación real sigue bloqueada hasta módulos posteriores y producción sigue **NO-GO**.

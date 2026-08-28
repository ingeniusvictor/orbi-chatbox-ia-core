# ORBI ChatBox IA Core

ORBI ChatBox IA Core es una aplicación frontend modular para atención conversacional empresarial, captura de leads, simulación de Web Widget, preparación futura para WhatsApp Business, base de conocimiento local y paneles de diagnóstico comercial.

## Estado actual

- Versión: 0.12.1-premium-ux-refresh
- Estado: Sandbox / Demo avanzada
- Producción externa: Bloqueada
- WhatsApp real: No conectado
- Backend real: No creado todavía
- Persistencia actual: LocalStorage
- Rama de trabajo actual: feature/0k-13-minimal-backend-controlled-build

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react

## Comandos locales

Instalar dependencias:

```bash
npm install
```

Validar TypeScript:

```bash
npm run lint
```

Compilar:

```bash
npm run build
```

Ejecutar en local:

```bash
npm run dev
```

## Backend Receiver Sandbox

El receiver es un scaffold local controlado. No representa un backend productivo ni expone un endpoint público.

Comandos:

```bash
npm run server:check
npm run server:dev
```

Health check:

```txt
GET http://localhost:8787/api/health
```

Widget sandbox endpoint:

```txt
POST http://localhost:8787/api/public/widget/orbi_demo_widget_key/message
```

Este endpoint es local/sandbox y no crea leads reales, no llama IA externa, no usa base de datos y no conecta WhatsApp.

## Manual Test Console

La app incluye una consola local para probar el backend receiver sandbox desde el frontend.

1. Ejecutar backend: `npm run server:dev`
2. Ejecutar frontend: `npm run dev`
3. Abrir: `http://localhost:3000`
4. Ir a **Backend Roadmap**, abrir **Plan 0K-12B Receiver** y probar:
   - `GET /api/health`
   - `POST /api/public/widget/orbi_demo_widget_key/message`

La consola solo permite URLs locales `localhost`/`127.0.0.1` y no debe usarse con datos reales.

## Receiver Validation Hardening

El receiver sandbox valida la public key, el consentimiento, el mensaje, su máximo de 2000 caracteres y el `channel`. Los errores usan un `errorCode` seguro y consistente. No almacena mensajes, no llama IA externa, no crea leads reales, no conecta WhatsApp ni usa una base de datos.

## Arquitectura actual

La aplicación fue modularizada para evitar un monolito exportado desde Google AI Studio.

Estructura principal:

```txt
src/App.tsx
src/AppPremium.tsx
src/main.tsx
src/components/common/
src/components/workspaces/
src/data/
src/types/
```

## Guardrails

Este proyecto todavía no debe usarse en producción.

Bloqueado por diseño:

- Endpoint público productivo
- WhatsApp Business real
- Datos reales de clientes
- Backend productivo
- Base de datos real
- Deploy público sin revisión de seguridad

## Módulo actual

0K-13A.1 — Minimal Backend Receiver Controlled Scaffold

Objetivo: mantener un scaffold backend mínimo, local y controlado, sin deploy productivo y sin datos reales.

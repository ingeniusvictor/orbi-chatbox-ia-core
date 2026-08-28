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
npm install

Validar TypeScript:
npm run lint

Compilar:
npm run build

Ejecutar en local:
npm run dev

## Arquitectura actual

La aplicación fue modularizada para evitar un monolito exportado desde Google AI Studio.

Estructura principal:
- src/App.tsx
- src/AppPremium.tsx
- src/main.tsx
- src/components/common/
- src/components/workspaces/
- src/data/
- src/types/

## Guardrails

Este proyecto todavía no debe usarse en producción.

Bloqueado por diseño:
- Endpoint público productivo
- WhatsApp Business real
- Datos reales de clientes
- Backend productivo
- Base de datos real
- Deploy público sin revisión de seguridad

## Próximo módulo

0K-13A.1 — Minimal Backend Receiver Controlled Scaffold

Objetivo: preparar un scaffold backend mínimo, local y controlado, sin deploy productivo y sin datos reales.

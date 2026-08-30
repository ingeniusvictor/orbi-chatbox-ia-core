# Preview Environment Requirements Pack

> **Estado:** REQUIREMENTS ONLY / NO DEPLOY / PRODUCTION BLOCKED

## Propósito

Definir los requisitos mínimos para preparar una futura prueba controlada del ORBI ChatBox Web Widget en un ambiente *preview*. Este documento no autoriza despliegue, ejecución de preview ni integración productiva.

## Decisión actual

- Local MVP: READY.
- Preview preparation: CONDITIONAL GO.
- Preview real: NO-GO hasta completar todos los pendientes.
- Production: NO-GO.

## Requisitos de ambiente preview

### 1. Dominio preview

Debe existir un dominio o URL de preview controlado, por ejemplo `https://preview-orbi-example.vercel.app`, `https://orbiecosystem-preview.example` u otra URL autorizada explícitamente por Víctor.

Requisitos:

- No debe ser producción final.
- Debe poder retirarse o revertirse rápido.
- Debe estar identificado como prueba.
- Debe usar solo textos sintéticos.

**Estado actual:** PENDING.

### 2. Backend controlado

Debe existir una URL de backend controlado, no productivo.

Requisitos:

- No debe ser localhost si se prueba desde una web pública.
- No debe ser producción.
- Debe mantener modo sandbox.
- Debe responder health check.
- Debe tener logs seguros.
- No debe persistir datos reales.
- No debe llamar IA externa.
- No debe conectar WhatsApp.
- No debe conectar base de datos real.

**Estado actual:** PENDING.

### 3. CORS allowlist

Debe existir una allowlist explícita.

Requisitos:

- Permitir solo el dominio preview.
- No usar wildcard `*`.
- No habilitar cualquier origen.
- Mantener bloqueo para dominios no autorizados.

**Estado actual:** PENDING.

### 4. Public key preview

Debe existir una public key no secreta para el widget preview.

Requisitos:

- No debe ser secreta.
- Debe estar limitada al ambiente preview.
- Debe poder invalidarse.
- No debe reutilizarse como clave productiva.

**Estado actual:** PENDING.

### 5. Variables de entorno preview

Definir variables futuras, sin crearlas todavía:

```text
ORBI_SERVER_PORT
ORBI_ALLOWED_ORIGINS
ORBI_DEMO_WIDGET_PUBLIC_KEY
ORBI_AUDIT_LOG_ENABLED
ORBI_WIDGET_RATE_LIMIT_WINDOW_MS
ORBI_WIDGET_RATE_LIMIT_MAX_REQUESTS
```

Posibles variables futuras:

```text
ORBI_PREVIEW_MODE=true
ORBI_REAL_DATA_ALLOWED=false
ORBI_BACKEND_PUBLIC_BASE_URL
ORBI_WIDGET_PUBLIC_KEY_PREVIEW
```

**Estado actual:** PENDING.

### 6. Política de datos demo

Requisitos:

- Solo mensajes sintéticos.
- No nombres, teléfonos ni correos reales.
- No clientes reales.
- No promesas comerciales reales.
- No seguimiento comercial real.
- No retención fuera del sandbox/controlado.

**Estado actual:** PENDING.

### 7. Responsable de prueba

Debe definirse:

- Responsable técnico.
- Responsable de aprobación.
- Responsable de rollback.

Sugerencia inicial: aprobación Víctor; soporte web Simon, si aplica; ejecución técnica pendiente.

**Estado actual:** PENDING.

### 8. Evidencia requerida

Antes de ejecutar preview, capturar:

- Commit SHA.
- Resultado de `npm run lint`.
- Resultado de `npm run build`.
- Resultado de `npm run server:check`.
- Resultado de `npm run server:qa`.
- Captura de Chat Studio backend sandbox.
- Captura de Web Widget backend sandbox.
- Captura de Lead Intelligence con sandbox lead.
- URL preview.
- Backend URL controlado.
- CORS allowlist usada.
- Public key preview usada.
- Resultado de rollback.

**Estado actual:** PENDING.

### 9. Rollback requerido

Debe existir un procedimiento claro para:

- Retirar el snippet.
- Desactivar widget preview.
- Retirar dominio de CORS allowlist.
- Invalidar public key preview.
- Confirmar que no hay datos reales persistidos.
- Documentar resultado.

**Estado actual:** PENDING.

## Matriz de readiness

| Requirement | Status | Owner | Notes |
| --- | --- | --- | --- |
| Preview domain | PENDING | Víctor / soporte web por definir | Debe ser no productivo y reversible. |
| Controlled backend URL | PENDING | Responsable técnico por definir | Sandbox, sin IA externa, WhatsApp ni DB real. |
| CORS allowlist | PENDING | Responsable técnico por definir | Solo el dominio preview; sin wildcard. |
| Preview public key | PENDING | Responsable técnico por definir | No secreta, limitada e invalidable. |
| Demo data policy | PENDING | Responsable de aprobación por definir | Solo datos sintéticos. |
| Validation evidence | CONDITIONAL | Responsable técnico por definir | QA local disponible; falta evidencia de preview. |
| Rollback plan | PENDING | Responsable de rollback por definir | Debe validarse antes de una prueba. |
| Victor approval | PENDING | Víctor | Requisito explícito para ejecutar preview. |

## Decisión recomendada actual

**CONDITIONAL GO** para preparar requisitos. **NO-GO** para prueba preview real hasta completar todos los `PENDING`. **NO-GO absoluto** para producción.

## Próxima fase recomendada

`0K-14C.3 — Preview Configuration Template`

La arquitectura de la suite que estos requisitos preparan está en [Installable Widget Suite Architecture](./INSTALLABLE_WIDGET_SUITE_ARCHITECTURE.md).

Para la futura prueba específica de ORBI, consultar [ORBI Website Preview Package](./ORBI_WEBSITE_PREVIEW_PACKAGE.md).

La decisión de avanzar hacia ejecución preview debe pasar por [Controlled Web Preview Execution Gate](./CONTROLLED_WEB_PREVIEW_EXECUTION_GATE.md).

Los inputs específicos de ORBI para esa decisión se registran en [Controlled Preview Execution Inputs](./CONTROLLED_PREVIEW_EXECUTION_INPUTS.md).

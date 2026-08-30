# Controlled Embed Instruction Pack

> **Estado:** DOCUMENTATION ONLY / PRODUCTION BLOCKED

## Propósito

Entregar instrucciones para una futura prueba controlada del ORBI ChatBox Web Widget en una web ORBI de *preview* o en otro entorno explícitamente controlado. Este documento no autoriza una integración productiva ni contiene un procedimiento de despliegue.

## Qué ya está listo en sandbox local

- Web Widget en modo Demo local.
- Web Widget en modo Backend sandbox.
- Backend receiver local.
- Validación segura de mensajes.
- Captura de lead sandbox.
- Lead Intelligence local.
- Receiver QA Matrix.

## Qué NO se debe hacer todavía

- No pegar el snippet en producción.
- No usar datos reales ni clientes reales.
- No conectar WhatsApp.
- No conectar IA externa.
- No conectar una base de datos real.
- No abrir un endpoint público.
- No prometer atención automática productiva ni SLA.
- No reutilizar la clave o URL de ejemplo de este documento.

## Preflight antes de cualquier prueba controlada

1. Confirmar que se usará un ambiente *preview* o controlado.
2. Confirmar que no se usará producción.
3. Confirmar el dominio permitido.
4. Confirmar la URL del backend controlado.
5. Confirmar que la public key no es secreta y está limitada al ambiente controlado.
6. Confirmar la allowlist de CORS para el dominio de *preview*.
7. Confirmar los textos visibles de demo/sandbox.
8. Confirmar la política de datos demo y usar únicamente mensajes sintéticos.
9. Ejecutar `npm run lint`.
10. Ejecutar `npm run build`.
11. Ejecutar `npm run server:check`.
12. Ejecutar `npm run server:qa`.
13. Probar Chat Studio en modo Backend sandbox.
14. Probar Web Widget en modo Backend sandbox.
15. Confirmar el procedimiento de rollback manual antes de habilitar la prueba.

## Snippet conceptual — NO PRODUCTIVO

El siguiente ejemplo es solo una guía de configuración futura. Sus valores son marcadores de posición, no debe copiarse a producción y no representa un widget publicable todavía.

```html
<!-- ORBI ChatBox IA Core — Controlled Preview Only -->
<!-- NO USAR EN PRODUCCIÓN -->
<script>
  window.ORBI_CHATBOX_CONFIG = {
    mode: "controlled-preview",
    receiverUrl: "https://CONTROLLED-BACKEND-URL.example",
    publicKey: "CONTROLLED_PUBLIC_WIDGET_KEY",
    environment: "preview",
    realDataAllowed: false
  };
</script>
<script src="/orbi-chatbox-widget-preview.js"></script>
```

## Ejecución futura controlada

Solo después de una autorización explícita para un ambiente de *preview*:

1. Registrar el dominio de *preview* en la allowlist de CORS del backend controlado.
2. Usar una URL controlada que no sea de producción y una public key específica de *preview*.
3. Mantener `realDataAllowed: false` y enviar solamente fixtures sintéticos.
4. Verificar en pantalla que el widget comunica modo demo/sandbox, no atención productiva.
5. Realizar una única prueba de mensaje sintético y revisar la respuesta controlada.
6. Detener la prueba ante cualquier respuesta inesperada, intento de persistencia real o acceso fuera de localhost/preview autorizado.

## Rollback manual

Antes de una prueba, dejar preparado un rollback simple y verificable:

1. Quitar el snippet de la página de *preview* o desactivar su carga mediante el mecanismo de *preview* aprobado.
2. Retirar el dominio de la allowlist de CORS controlada.
3. Invalidar la public key de *preview* si se hubiera emitido una.
4. Confirmar que no existen leads, mensajes ni datos fuera del sandbox local/controlado.
5. Documentar el resultado de la prueba sin incluir datos personales.

## Referencias

- [Web ORBI Embed Controlled Plan](./WEB_ORBI_EMBED_CONTROLLED_PLAN.md)
- [Controlled Preview Readiness Gate](./CONTROLLED_PREVIEW_READINESS_GATE.md)
- [Receiver QA Matrix](./RECEIVER_LOCAL_QA_MATRIX.md)

La integración productiva permanece bloqueada hasta que exista una decisión explícita, un entorno autorizado y controles revisados para esa fase.

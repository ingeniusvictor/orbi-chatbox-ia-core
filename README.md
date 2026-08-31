# ORBI ChatBox IA Core v0.13.0-functional-mvp-demo

## 0K-18B.2 — Structured Knowledge Context Integration

Structured knowledge lookup results now join the existing `KnowledgeContext`: structured entries are prioritized, while the legacy local catalog fills the remaining capacity. The global limit remains three entries and 1200 characters, with entry and source provenance preserved. This keeps the 0K-14 local lookup route active and does not enable external connectors.

ORBI ChatBox IA Core es una aplicación frontend modular para atención conversacional empresarial, captura de leads, simulación de Web Widget, preparación futura para WhatsApp Business, base de conocimiento local y paneles de diagnóstico comercial.

## Estado actual

- 0K-18 — Knowledge Engine Expansion: CLOSED
- 0K-18A family: CLOSED
- 0K-18B family: CLOSED
- 0K-18C.1: CLOSED
- Knowledge Engine: contratos de fuentes y entradas estructuradas, lookup determinista, `KnowledgeContext` estructurado + local con procedencia, grounding acotado y validación qwen-local. La ingesta controlada futura queda fuera de 0K-18.
- 0K-19 — Minimal Conversation Continuity: ACTIVE
- 0K-19A.1: CLOSED — contrato de turnos efímeros `user`/`assistant`, con contenido acotado y orden por secuencia.
- 0K-19A.2: historial sólo en RAM del backend, aislado por conversación, máximo 8 turnos y 6000 caracteres, con expulsión FIFO. Desaparece al reiniciar el proceso; no hay memoria persistente, perfiles, memoria entre sesiones ni integración al provider.

- Versión: v0.13.0-functional-mvp-demo
- Estado: PASS — MVP funcional demo/sandbox
- Producción externa: Bloqueada
- WhatsApp real: No conectado
- Backend receiver sandbox local: Implementado
- Backend productivo: No implementado
- Persistencia actual: LocalStorage
- Bloque 0K-13: Cerrado
- Rama de trabajo actual: feature/0k-14-local-knowledge-foundation

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

## Deterministic Processing Layer

0K-13A.1 permanece cerrado. 0K-13A.2 añade una capa interna y sin efectos laterales entre la validación y la respuesta HTTP. Genera un `requestId` local, conserva el canal, normaliza solo espacios del mensaje y devuelve longitud, modo fijo `sandbox` e intención fija `unclassified`; no clasifica con IA ni persiste contenido.

## Minimal Conversation Envelope

0K-13A.3 conserva el procesamiento de 0K-13A.2 y añade un envelope interno por solicitud. Conserva contexto validado y procesado, y usa un `conversationId` efímero local: no representa almacenamiento, memoria ni una conversación persistida.

## Local Knowledge Foundation

0K-14A.1, 0K-14A.2 y 0K-14A.3 están cerrados: el registry server-side es estático, tipado y de solo lectura; su lookup es léxico determinista; y el contexto es interno y acotado. 0K-14B.1 conecta ese contexto al pipeline local. El módulo actual 0K-14B.2 compone una respuesta acotada a partir del primer resultado del contexto: `Widget → Receiver → Validation → Processing → Knowledge Retrieval → Bounded Context → Deterministic Knowledge Response`. La respuesta deriva solo de conocimiento estático sandbox local; no usa IA generativa, fuentes externas, búsqueda semántica ni datos productivos.

Validar el registry local:

```bash
npm run server:knowledge:qa
```

## AI Provider Abstraction

0K-14, la familia 0K-15A, 0K-15B.1 y 0K-15B.2 están cerrados. El módulo actual 0K-15B.3 clasifica providers soportados: desarrollo (**Mock**), local/on-premise (**Qwen Local**, **Gemma Local**) y cloud (**OpenAI/ChatGPT**, **Gemini**). Sólo **Mock** está habilitado, activo y es ejecutable. Los providers locales y cloud son futuros arquitectónicos: no tienen credenciales, modelo runtime, API ni llamadas externas. ORBI podrá operar en futuros despliegues sin requerir obligatoriamente una API cloud de pago.

0K-15C.1 añade un contrato de readiness para un futuro runtime local: su configuración sólo acepta endpoints loopback y se valida sin conexión. 0K-15C.2 añade el contrato de health probe sintético; no existe un sondeo de red real todavía y `reachable` se usa sólo en QA. Qwen Local y Gemma Local siguen siendo futuros y no ejecutables; Mock sigue siendo el único provider activo y ejecutable.

0K-16A.1 añade un transporte genérico sólo para loopback (`localhost`, `127.0.0.1`, `::1`): rechaza LAN/exterior, no sigue redirects y limita timeout y respuesta. No activa proveedores ni contratos específicos de modelos.

0K-16A.2 añade un adapter de salud Ollama para `GET /api/version` local mediante ese transporte. No llama generación, no carga ni descarga modelos; Mock continúa como único provider ejecutable.

0K-16A.3 añade el contrato y mappers de un futuro adapter de proveedor local. No hay generación local habilitada: `qwen-local` y `gemma-local` permanecen deshabilitados, Ollama conserva sólo su health check y Mock continúa como único provider ejecutable.

0K-16B.1 cierra la familia 0K-16A y habilita arquitectónicamente `qwen-local`, aunque `mock` sigue activo por defecto. Qwen usa Ollama sólo por loopback mediante `POST /api/generate`, con QA sobre servidor sintético local; no instala ni descarga modelos. Gemma, OpenAI y Gemini continúan deshabilitados.

0K-16B.2 añade selección local controlada no secreta mediante `ORBI_AI_PROVIDER`. Si falta, usa `mock`; sólo acepta `mock` o `qwen-local`. `qwen-local` requiere Ollama/modelo local ya disponible, sin instalación ni descarga automática. Valores inválidos no hacen fallback silencioso y los clientes HTTP no pueden seleccionar proveedor.

0K-16B.3-R2 valida la ruta real local con `qwen3:1.7b`, `think: false` y `stream: false` en Ryzen 7 serie 4000 / 16 GB RAM: la prueba ORBI end-to-end de contexto conocido respondió en aproximadamente 12 s. Qwen sigue siendo opcional, `mock` permanece como valor por defecto y la ruta local no requiere dependencias cloud. `qwen3:4b` no fue viable dentro del timeout seguro en esta máquina.

0K-16C.1 endurece la operación local: `qwen3:1.7b` comprueba salud de Ollama antes de generar y mapea fallos de runtime, modelo, timeout, respuesta inválida y generación a errores HTTP controlados. No existe fallback silencioso; `mock` permanece activo por defecto y Qwen es seleccionable sólo por configuración local.

0K-16 está cerrado. El bloque activo 0K-17 — LUMI Personality & Identity Layer — inicia con 0K-17A.1: LUMI es **ORBI Intelligent Companion**, la identidad visible de ORBI. Es un contrato estático e independiente de proveedores: no integra prompts o runtime todavía, ni incluye una implementación visual o widget.

0K-17A.2 compone esa identidad en una instrucción de asistente determinista, acotada y neutral respecto de proveedores.

0K-17A.3 integra la instrucción canónica de LUMI en el request común de proveedores. `qwen-local` consume únicamente esa instrucción genérica junto al contexto de conocimiento y el mensaje; la personalidad no es fuente de grounding. El mock continúa compatible. No hay integración visual/avatar, memoria ni herramientas.

0K-17A está cerrado. 0K-17B.1 mantiene la identidad canónica y su `AssistantInstruction` completo como fuente de verdad, y deriva una `AssistantRuntimeInstruction` compacta, neutral respecto de proveedores, para modelos locales ligeros. No es otra personalidad: sólo evita enviar el texto canónico completo al prompt de ejecución.

0K-17B.2 agrega una política de respuesta de LUMI neutral respecto de proveedores: sigue el idioma del usuario cuando es claro (incluido español), equilibra concisión y detalle, conserva incertidumbre y grounding, evita la presentación repetitiva y sólo propone siguientes pasos cuando aportan valor. No añade memoria ni perfilado de usuarios.

0K-17 está cerrado. 0K-18 — Knowledge Engine Expansion — inicia con 0K-18A.1: un contrato estructurado y estático para describir fuentes de conocimiento ORBI. Los descriptores no son contenido ni activan ingesta; no hay conectores de Drive, Notion o web, y la recuperación sintética de 0K-14 permanece sin cambios.

0K-18A.2 añade entradas estructuradas fundacionales con procedencia obligatoria, límites, versión, estado y autoridad validada contra su fuente. Aún no están conectadas a la recuperación de runtime.

0K-18B.1 permite buscar entradas estructuradas activas de forma determinista; el estado de fuente participa en elegibilidad y la autoridad sólo desempata. No usa embeddings ni modifica el lookup/runtime de 0K-14.

Validar el contrato estructural local:

```bash
npm run server:ai-contract:qa
npm run server:local-ai:qa
```

## Receiver Local QA Matrix

La matriz local de QA valida el contrato del receiver con fixtures sintéticos: health, mensaje válido, public key inválida, mensaje vacío o largo, consentimiento ausente, channel inválido, JSON malformado, ruta inexistente y origin bloqueado.

1. En una terminal, ejecutar `npm run server:dev`.
2. En otra terminal, ejecutar `npm run server:qa`.
3. El script termina con `Receiver QA: PASS` o un código de salida distinto de cero si falla un caso.

Por defecto usa `http://127.0.0.1:8787`. Puede probarse el listener local alternativo con `ORBI_RECEIVER_QA_URL=http://localhost:8787 npm run server:qa`. La matriz solo admite `localhost`/`127.0.0.1`, no inicia el backend y no persiste resultados, mensajes ni datos. No usa datos reales, WhatsApp, IA externa ni base de datos.

## Functional MVP Demo Status

**PASS — MVP funcional demo/sandbox.**

Flujo principal:

1. El usuario escribe un mensaje sintético en Chat Studio.
2. El modo **Backend sandbox** lo envía al receiver local.
3. El backend valida public key, consentimiento, mensaje, channel y tamaño.
4. El backend responde HTTP 200 o un `errorCode` seguro.
5. El frontend muestra la respuesta controlada.
6. Tras HTTP 200, registra un lead sandbox local.
7. Lead Intelligence muestra el lead con badge **Sandbox Lead**.

El modo **Demo local** conserva la lógica simulada existente.

## Cómo ejecutar demo completa

Terminal 1:

```bash
npm run server:dev
```

Terminal 2:

```bash
npm run dev
```

Abrir `http://localhost:3000`, ir a **Chat Studio**, probar **Demo local**, cambiar a **Backend sandbox**, enviar un mensaje sintético y confirmar el lead sandbox en **Lead Intelligence**.

## QA local

Con el backend local corriendo, ejecutar:

```bash
npm run server:qa
```

Resultado esperado: `Receiver QA: PASS`.

## Web Widget Functional Bridge

1. Ejecutar `npm run server:dev`.
2. Ejecutar `npm run dev` y abrir `http://localhost:3000`.
3. Ir a **Web Widget**, seleccionar **Backend sandbox** y enviar un mensaje sintético.

El widget llama al receiver local, muestra la respuesta controlada y, tras HTTP 200, crea un lead sandbox visible en **Lead Intelligence**. No usa datos reales, WhatsApp, IA externa ni base de datos real.

## Web ORBI Embed Controlled Plan

El plan de preparación está en [docs/WEB_ORBI_EMBED_CONTROLLED_PLAN.md](docs/WEB_ORBI_EMBED_CONTROLLED_PLAN.md). El Web Widget funciona sólo en sandbox local; no es un embed productivo. Antes de probarlo en una web real controlada se deben definir dominio, CORS, backend controlado, política de datos demo y ejecutar QA local.

## Controlled Embed Instruction Pack

Las instrucciones para una futura prueba de preview controlada están en [docs/CONTROLLED_EMBED_INSTRUCTION_PACK.md](docs/CONTROLLED_EMBED_INSTRUCTION_PACK.md). El paquete es solo documental y mantiene la integración productiva bloqueada.

## Controlled Preview Readiness Gate

La evidencia y criterios de decisión están en [docs/CONTROLLED_PREVIEW_READINESS_GATE.md](docs/CONTROLLED_PREVIEW_READINESS_GATE.md). El estado recomendado es **CONDITIONAL GO** para preparar preview y **NO-GO** para producción; producción sigue bloqueada.

## Preview Environment Requirements Pack

Los requisitos previos de dominio, backend, CORS, public key, evidencia y rollback están en [docs/PREVIEW_ENVIRONMENT_REQUIREMENTS_PACK.md](docs/PREVIEW_ENVIRONMENT_REQUIREMENTS_PACK.md). Estado: **REQUIREMENTS ONLY / NO DEPLOY / PRODUCTION BLOCKED**; CONDITIONAL GO para preparar requisitos y NO-GO hasta completar pendientes.

## Installable Widget Suite Architecture

La arquitectura del producto instalable con ChatBox Web Widget y WhatsApp Floating Widget está en [docs/INSTALLABLE_WIDGET_SUITE_ARCHITECTURE.md](docs/INSTALLABLE_WIDGET_SUITE_ARCHITECTURE.md). La primera prueba futura será en Web ORBI y la arquitectura permitirá futuros clientes; estado: **ARCHITECTURE ONLY / NO DEPLOY / PRODUCTION BLOCKED**.

## WhatsApp Floating Widget Internal Module

El componente interno está documentado en [docs/WHATSAPP_FLOATING_WIDGET_INTERNAL_MODULE.md](docs/WHATSAPP_FLOATING_WIDGET_INTERNAL_MODULE.md). Opera solo como preview manual sandbox en Web Widget Workspace: no usa WhatsApp Business API, webhook, automatización ni producción.

## Unified Floating Launcher Sandbox

El hub interno que une Chat IA y WhatsApp manual está documentado en [docs/UNIFIED_FLOATING_LAUNCHER_SANDBOX.md](docs/UNIFIED_FLOATING_LAUNCHER_SANDBOX.md). Voz permanece futura/desactivada; no hay instalación web real ni producción. El preview interno está disponible en Web Widget Workspace.

## Installable Client Config Template

Los tipos y configuraciones template están documentados en [docs/INSTALLABLE_CLIENT_CONFIG_TEMPLATE.md](docs/INSTALLABLE_CLIENT_CONFIG_TEMPLATE.md). Incluyen una config demo ORBI sandbox y un template preview seguro que alimenta el Unified Floating Launcher; no contienen secretos, datos reales ni habilitan producción.

## ORBI Website Preview Package

El paquete para preparar una futura prueba en web ORBI está en [docs/ORBI_WEBSITE_PREVIEW_PACKAGE.md](docs/ORBI_WEBSITE_PREVIEW_PACKAGE.md). Estado: **PREVIEW PACKAGE / NO INSTALL / NO DEPLOY / PRODUCTION BLOCKED**; no instala ni modifica la web ORBI todavía.

## Controlled Web Preview Execution Gate

La decisión de ejecución está documentada en [docs/CONTROLLED_WEB_PREVIEW_EXECUTION_GATE.md](docs/CONTROLLED_WEB_PREVIEW_EXECUTION_GATE.md). Estado: **EXECUTION GATE / NO DEPLOY / PRODUCTION BLOCKED**; hay CONDITIONAL GO para preparación y NO-GO para ejecución real hasta contar con URL preview, backend controlado, CORS, public key y autorización final.

## Controlled Preview Execution Inputs

La plantilla para completar los inputs de ejecución está en [docs/CONTROLLED_PREVIEW_EXECUTION_INPUTS.md](docs/CONTROLLED_PREVIEW_EXECUTION_INPUTS.md). Estado: **INPUT TEMPLATE / NO EXECUTION / NO DEPLOY / PRODUCTION BLOCKED**; hay CONDITIONAL GO para completar inputs y NO-GO para ejecutar preview real.

## Controlled Preview Dry Run Plan

El ensayo local previo está en [docs/CONTROLLED_PREVIEW_DRY_RUN_PLAN.md](docs/CONTROLLED_PREVIEW_DRY_RUN_PLAN.md). Estado: **DRY RUN PLAN / NO EXECUTION / NO DEPLOY / PRODUCTION BLOCKED**; no toca Web ORBI ni ejecuta preview real.

## Validaciones obligatorias

```bash
npm run lint
npm run build
npm run server:check
npm run server:qa
```

## Guardrails

- Producción externa: bloqueada
- WhatsApp real: bloqueado
- Base de datos real: bloqueada
- Datos reales: bloqueados
- IA externa: bloqueada
- Leads reales: bloqueados
- Persistencia: `localStorage` demo/sandbox
- Backend listener: `127.0.0.1`
- URLs del receiver frontend: `localhost` / `127.0.0.1`

## Limitaciones conocidas

- No es producción ni tiene login o multiempresa real.
- No tiene WhatsApp real, voz, base de datos real ni IA externa conectada.
- El Web Widget bridge solo está disponible para el sandbox local; no es un embed productivo.
- Los leads son exclusivamente sandbox/demo.

## Próximas fases, sin implementar ahora

1. Web ORBI embed controlado.
2. WhatsApp Business bajo volumen.
3. IA real con Knowledge Base ORBI.
4. Voz oficial ORBI.
5. Base de datos real.
6. Escalamiento para mayor volumen.

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

0K-13C.1 — Functional MVP Close

Objetivo: mantener un MVP funcional, local y controlado, sin deploy productivo ni datos reales.

Estado de cierre: 0K-13A.1, 0K-13A.2 y 0K-13A.3 están cerrados; 0K-13C.1 verifica el flujo funcional local completo.

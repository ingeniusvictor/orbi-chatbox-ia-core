# Receiver fixtures

Estos fixtures solo contienen datos sintéticos para la matriz local de QA. `long-message.json` no se guarda para evitar un archivo JSON artificialmente grande: `server/scripts/runReceiverQa.ts` genera en memoria el único mensaje de 2001 caracteres requerido para ese caso. Ningún fixture se persiste ni se envía fuera del receiver local.

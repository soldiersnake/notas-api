# Implementación Spec 002 — Migración de `notesStore` a Mongoose

## Resumen de cambios
- Añadido `mongoose` a dependencias en `package.json`.
- Modificados los scripts `start` y `dev` en `package.json` para utilizar el flag nativo `--env-file-if-exists=.env` sin requerir dependencias de `dotenv`.
- Creado módulo `src/db.ts` con `connectDB()` y `disconnectDB()`, abortando con `process.exit(1)` si la base de datos no está disponible al iniciar.
- Actualizado `src/models/nota.ts` con Schema y Model de Mongoose tipados estrictamente (sin `any`), utilizando `_id` de tipo `String` con `randomUUID()` por defecto y exclusión de `_id` y `__v`.
- Migrado `src/data/notesStore.ts` de array en memoria a operaciones asíncronas con Mongoose (`getAllNotes`, `getNoteById`, `createNote`, `updateNote`, `deleteNote`), retornando objetos planos tipo `Nota`.
- Actualizado `src/routes/notes.ts` a controladores `async/await` manteniendo el orden de comprobación en `PUT /notes/:id` (404 antes de 400) y exactitud en mensajes de error y códigos HTTP (200, 201, 400, 404).
- Conexión a MongoDB inicializada en el arranque en `src/index.ts`, manteniendo `src/app.ts` desacoplado.

## Verificación realizada
- `npm run build` compila con 0 errores bajo `strict: true`.
- Verificado que no hay uso de `any` en `src/`.
- Verificado que un fallo de conexión a MongoDB al arrancar termina el proceso con código `1`.
- Probados los 5 endpoints con `curl` (`GET /notes`, `GET /notes/:id`, `POST /notes`, `PUT /notes/:id`, `DELETE /notes/:id`).
- Verificada persistencia real en MongoDB entre reinicios del proceso Node.

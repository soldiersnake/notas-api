# Spec 002 — Migración de `notesStore` de memoria a Mongoose

## 1. Objetivo
Migrar el almacenamiento de notas (`src/data/notesStore.ts`) de un array en memoria a MongoDB utilizando Mongoose, conservando intacto el contrato HTTP actual de la API (métodos, rutas bajo `/notes`, códigos de estado `200`/`201`/`400`/`404`, textos de error y forma exacta del objeto `Nota`).

## 2. Contexto actual del código
- `src/models/nota.ts`: define la interfaz `Nota` con `{ id: string; titulo: string; contenido: string; fecha: string }`.
- `src/data/notesStore.ts`: exporta actualmente `export const notes: Nota[] = [];`.
- `src/routes/notes.ts`: importa `notes` y realiza operaciones síncronas en memoria (`find`, `push`, `findIndex`, `splice`), usando `randomUUID()` para `id` y `new Date().toISOString()` para `fecha`.
- `src/index.ts`: inicia Express directamente con `app.listen(PORT)`.

## 3. Alcance
- **Dependencias**:
  - Instalar `mongoose` en `dependencies` de `package.json` (requiere aprobación de esta spec según reglas de `AGENTS.md`).
- **Conexión a base de datos**:
  - Configurar la conexión a MongoDB mediante `MONGODB_URI` (con fallback a `mongodb://localhost:27019/notas-api` o lectura desde `.env`).
  - Inicializar la conexión en el arranque del servidor (`src/index.ts` o módulo invocado desde él) sin acoplar la conexión en `src/app.ts` para facilitar futuros tests.
- **Modelo y tienda de datos (`src/data/notesStore.ts` / `src/models/nota.ts`)**:
  - Mantener la interfaz TypeScript `Nota` (`id`, `titulo`, `contenido`, `fecha` como `string`).
  - Definir el Schema y Model de Mongoose asegurando TypeScript estricto (sin `any`).
  - Transformar o exponer en `src/data/notesStore.ts` las operaciones de acceso a datos asíncronas (`getAllNotes`, `getNoteById`, `createNote`, `updateNote`, `deleteNote` o equivalente) respaldadas por Mongoose en lugar del array en memoria.
  - Garantizar que los objetos devueltos cumplan exactamente la interfaz `Nota` (`{ id, titulo, contenido, fecha }`), sin exponer `_id` ni `__v`.
- **Rutas (`src/routes/notes.ts`)**:
  - Pasar los handlers de `/notes` a `async/await` consumiendo `notesStore.ts`.
  - Conservar exactamente el comportamiento actual en cada endpoint:
    - `GET /notes`: `200 OK` con array JSON de `Nota`.
    - `GET /notes/:id`: `200 OK` con `Nota` o `404 Not Found` con `{ error: "Nota con id '<id>' no encontrada." }`.
    - `POST /notes`: valida `titulo` y `contenido` (cadenas no vacías tras `.trim()`); si falla devuelve `400 Bad Request` con `{ error: "Campos inválidos. 'titulo' y 'contenido' son requeridos y deben ser cadenas no vacías." }`; si es válido crea la nota con `.trim()` y devuelve `201 Created` con la `Nota`.
    - `PUT /notes/:id`: si no existe la nota devuelve `404 Not Found` con `{ error: "Nota con id '<id>' no encontrada." }`; si el cuerpo es inválido devuelve `400 Bad Request` con el mismo mensaje de validación; si es válido actualiza `titulo` (`.trim()`), `contenido` (`.trim()`) y renueva `fecha` (ISO 8601), devolviendo `200 OK` con la `Nota` actualizada.
    - `DELETE /notes/:id`: si no existe devuelve `404 Not Found` con `{ error: "Nota con id '<id>' no encontrada." }`; si existe la elimina de MongoDB y devuelve `200 OK` con `{ message: "Nota eliminada correctamente.", nota: <Nota eliminada> }`.

## 4. Fuera de alcance
- Nuevos endpoints, filtros, ordenación o paginación.
- Modificación de códigos de estado HTTP, estructura de respuesta o mensajes de error.
- Desarrollo de frontend (`web/`).

## 5. Criterios de aceptación (verificables por Dwight)
1. **Compilación y tipado**: `npm run build` compila sin errores en modo `strict: true` y no existe ningún uso de `any` en `src/`.
2. **Persistencia real**: Las notas creadas con `POST /notes` permanecen al reiniciar el proceso de Node y vuelven a listarse en `GET /notes`.
3. **Contrato de `Nota` limpio**: Ninguna respuesta de `GET`, `POST`, `PUT` o `DELETE` incluye `_id` ni `__v`; todas contienen únicamente `id`, `titulo`, `contenido` y `fecha` (ISO 8601).
4. **Paridad en `POST /notes`**:
   - Cuerpo válido con espacios laterales aplica `.trim()` y responde `201` con la nota creada.
   - Cuerpo sin `titulo`/`contenido`, no string o solo espacios responde `400` con `{ error: "Campos inválidos. 'titulo' y 'contenido' son requeridos y deben ser cadenas no vacías." }`.
5. **Paridad en `GET /notes/:id`**:
   - ID existente responde `200` con la nota.
   - ID inexistente (sea un UUID aleatorio o cualquier cadena arbitraria como `"abc"`) responde `404` con `{ error: "Nota con id '<id>' no encontrada." }` (nunca `500` por `CastError`).
6. **Paridad en `PUT /notes/:id`**:
   - ID inexistente responde `404` con `{ error: "Nota con id '<id>' no encontrada." }`.
   - ID existente con cuerpo inválido responde `400` con el mensaje estándar de validación.
   - ID existente con cuerpo válido actualiza `titulo`, `contenido` y `fecha`, respondiendo `200` con la nota actualizada.
7. **Paridad en `DELETE /notes/:id`**:
   - ID inexistente responde `404` con `{ error: "Nota con id '<id>' no encontrada." }`.
   - ID existente elimina el documento en MongoDB y responde `200` con `{ message: "Nota eliminada correctamente.", nota: { id, titulo, contenido, fecha } }`.

## 6. Riesgos y decisiones abiertas
- **[Pregunta abierta 1 — Formato de `id`: UUID v4 vs `ObjectId`]**:
  - *Opción A (UUID v4 — recomendada para cero fricción de contrato)*: Seguir generando `id` con `randomUUID()` y guardarlo como string en el documento (o como `_id: { type: String, default: randomUUID }`). Evita `CastError` con IDs no hexadecimales y mantiene intacta la documentación actual de `README.md`.
  - *Opción B (`ObjectId` nativo de Mongo)*: Usar el `_id` de Mongoose transformado a `id` string en `toJSON`, validando `isValidObjectId(id)` antes de consultar para devolver `404` en lugar de `500` cuando el formato no sea válido.
  - **Decisión requerida**: ¿Se mantiene UUID v4 (Opción A) o se adopta `ObjectId` serializado como string (Opción B)?
- **[Pregunta abierta 2 — Carga de `.env`]**:
  - ¿Se utiliza el soporte nativo de Node (`--env-file-if-exists=.env` en los scripts `dev` y `start` de `package.json`, sin dependencias extra) o se instala el paquete `dotenv`?
- **[Pregunta abierta 3 — Orden de validación en `PUT /notes/:id`]**:
  - En la implementación actual en memoria, `PUT /notes/:id` verifica primero si la nota existe (`404`) y después valida el cuerpo (`400`). Con base de datos, validar el cuerpo en memoria (`400`) antes de consultar MongoDB ahorra una query cuando el payload es inválido, o bien se puede usar `findOne` primero para preservar el orden exacto `404` → `400`. ¿Se mantiene el orden estricto `404` antes que `400`?
- **[Pregunta abierta 4 — Fallo de conexión al arrancar]**:
  - Si MongoDB no responde al iniciar `src/index.ts`, ¿el proceso debe registrar el error y terminar con `process.exit(1)`? *(Recomendado: sí, `process.exit(1)`)*.

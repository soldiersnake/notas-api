# notas-api

API REST de notas (Express + TypeScript + Mongoose). Persistencia en MongoDB (`docker compose` en puerto `27019`).

## Comandos
- `docker compose up -d`: levanta MongoDB local (`localhost:27019`)
- `npm run dev`: desarrollo (carga `.env` si existe)
- `npm run build`: compila a `dist/`
- `npm run start`: inicia versión compilada (`dist/index.js`)

## Estructura
- `src/index.ts`: conexión a MongoDB y arranque del servidor
- `src/app.ts`: configuración de Express
- `src/db.ts`: conexión/desconexión a MongoDB (`connectDB`, `disconnectDB`)
- `src/routes/notes.ts`: endpoints `/notes`
- `src/models/nota.ts`: interfaz `Nota` y modelo Mongoose (`id` UUID, `titulo`, `contenido`, `fecha`)
- `src/data/notesStore.ts`: acceso a datos con Mongoose
- `docker-compose.yml`: servicio MongoDB (`mongo:7`, puerto `27019:27017`)
- `.env.example`: plantilla de variables (`PORT`, `MONGODB_URI`)
- `specs/`: specs de tareas (`NNN-nombre.md`) e implementaciones (`NNN-nombre.impl.md`)

## Reglas
- TypeScript estricto, sin `any`.
- Cambios pequeños, una tarea por spec.
- No instalar dependencias sin que la spec lo pida.
- No tocar `dist/` ni `node_modules/` a mano.
- Antes de dar algo por terminado: `npm run build` sin errores.

## Flujo de trabajo
Spec (Pam) → aprobación de Mariano → implementación (Jim) → verificación (Dwight) → README si cambia la API (Kevin).

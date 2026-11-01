# notas-api

API REST de notas (Express + TypeScript). Datos en memoria, sin base de datos.

## Comandos
- `npm run dev`: desarrollo
- `npm run build`: compila a `dist/`
- `npm test`: tests (ajustar si el script se llama distinto)

## Estructura
- `src/index.ts`: arranque del servidor
- `src/app.ts`: configuración de Express
- `src/routes/notes.ts`: endpoints `/notes`
- `src/models/nota.ts`: tipo Nota (id, título, contenido, fecha)
- `src/data/notesStore.ts`: almacenamiento en memoria
- `specs/`: specs de tareas (`NNN-nombre.md`) e implementaciones (`NNN-nombre.impl.md`)
- `web/`: frontend (cuando exista)

## Reglas
- TypeScript estricto, sin `any`.
- Cambios pequeños, una tarea por spec.
- No instalar dependencias sin que la spec lo pida.
- No tocar `dist/` ni `node_modules/` a mano.
- Antes de dar algo por terminado: `npm run build` sin errores y tests en verde.

## Flujo de trabajo
Spec (Pam) → aprobación de Mariano → implementación (Jim) → verificación (Dwight) → README si cambia la API (Kevin).
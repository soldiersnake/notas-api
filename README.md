# notas-api

API REST desarrollada con **Express** y **TypeScript** para la gestión de notas almacenadas en memoria (sin base de datos).

## Características

- Modelo `Nota`:
  - `id`: string (UUID generado automáticamente)
  - `titulo`: string
  - `contenido`: string
  - `fecha`: string (ISO 8601)
- CRUD completo en memoria.
- Validación de campos requeridos (400 si faltan o están vacíos).
- Manejo de recursos inexistentes (404).

## Endpoints

| Método | Endpoint | Descripción | Respuestas |
|---|---|---|---|
| `GET` | `/notes` | Obtiene todas las notas | `200 OK` |
| `GET` | `/notes/:id` | Obtiene una nota por su ID | `200 OK`, `404 Not Found` |
| `POST` | `/notes` | Crea una nueva nota | `201 Created`, `400 Bad Request` |
| `PUT` | `/notes/:id` | Actualiza una nota existente | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/notes/:id` | Elimina una nota | `200 OK`, `404 Not Found` |

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo en modo observación (`tsx watch src/index.ts`).
- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist/` (`tsc`).
- `npm start`: Inicia el servidor compilado en producción (`node dist/index.js`).

## Variables de Entorno

- `PORT`: Puerto en el que escuchará el servidor (por defecto `3001`).

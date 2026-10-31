# notas-api

API REST para crear, consultar, actualizar y eliminar notas. Está desarrollada con Express y TypeScript; los datos se guardan en memoria y se pierden al reiniciar el servidor.

## Requisitos

- Node.js y npm instalados.

## Instalación y ejecución

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

La API escucha en `http://localhost:3001` de forma predeterminada. Se puede cambiar el puerto con la variable de entorno `PORT`.

Para compilar y ejecutar la versión compilada:

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev`: inicia el servidor de desarrollo con recarga automática.
- `npm run build`: compila TypeScript en `dist/`.
- `npm run start`: inicia el servidor compilado (`npm start` también funciona).

## Modelo `Nota`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Mi nota",
  "contenido": "Texto de ejemplo",
  "fecha": "2026-10-31T12:00:00.000Z"
}
```

`id` es un UUID generado por la API; `fecha` es una fecha y hora en formato ISO 8601. Al crear o actualizar una nota, `titulo` y `contenido` deben ser cadenas no vacías; se eliminan los espacios al principio y al final.

## Endpoints

Todos los ejemplos usan `http://localhost:3001` como dirección base.

### `GET /notes`

Devuelve todas las notas. No requiere cuerpo.

```http
GET /notes
```

Respuesta `200 OK`:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "Mi nota",
    "contenido": "Texto de ejemplo",
    "fecha": "2026-10-31T12:00:00.000Z"
  }
]
```

### `GET /notes/:id`

Devuelve la nota con el UUID indicado. No requiere cuerpo.

```http
GET /notes/550e8400-e29b-41d4-a716-446655440000
```

Respuesta `200 OK`:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Mi nota",
  "contenido": "Texto de ejemplo",
  "fecha": "2026-10-31T12:00:00.000Z"
}
```

Error `404 Not Found` si no existe:

```json
{
  "error": "Nota con id '550e8400-e29b-41d4-a716-446655440000' no encontrada."
}
```

### `POST /notes`

Crea una nota. Envíe `titulo` y `contenido` en el cuerpo JSON.

```http
POST /notes
Content-Type: application/json
```

```json
{
  "titulo": "Mi nota",
  "contenido": "Texto de ejemplo"
}
```

Respuesta `201 Created`: devuelve la nota creada, con `id` y `fecha` generados por la API.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Mi nota",
  "contenido": "Texto de ejemplo",
  "fecha": "2026-10-31T12:00:00.000Z"
}
```

Error `400 Bad Request` si falta algún campo o no es una cadena no vacía:

```json
{
  "error": "Campos inválidos. 'titulo' y 'contenido' son requeridos y deben ser cadenas no vacías."
}
```

### `PUT /notes/:id`

Actualiza una nota existente. Envíe ambos campos en el cuerpo JSON.

```http
PUT /notes/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

```json
{
  "titulo": "Título actualizado",
  "contenido": "Contenido actualizado"
}
```

Respuesta `200 OK`: devuelve la nota actualizada; `fecha` se actualiza.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Título actualizado",
  "contenido": "Contenido actualizado",
  "fecha": "2026-10-31T12:30:00.000Z"
}
```

Errores:

- `400 Bad Request` si falta `titulo` o `contenido`, o alguno no es una cadena no vacía. El cuerpo de error es el mismo que para `POST /notes`.
- `404 Not Found` si no existe el UUID. El cuerpo de error es el mismo que para `GET /notes/:id`.

### `DELETE /notes/:id`

Elimina la nota con el UUID indicado. No requiere cuerpo.

```http
DELETE /notes/550e8400-e29b-41d4-a716-446655440000
```

Respuesta `200 OK`:

```json
{
  "message": "Nota eliminada correctamente.",
  "nota": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "Mi nota",
    "contenido": "Texto de ejemplo",
    "fecha": "2026-10-31T12:00:00.000Z"
  }
}
```

Error `404 Not Found` si no existe el UUID. El cuerpo de error es el mismo que para `GET /notes/:id`.

# notas-api

API REST para crear, consultar, actualizar y eliminar notas. Está desarrollada con Express, TypeScript y Mongoose; los datos persisten en MongoDB. Si MongoDB no está disponible al iniciar, la API aborta el arranque (`exit 1`).

## Requisitos

- Node.js y npm instalados.
- Docker y Docker Compose instalados (para ejecutar MongoDB localmente en el puerto `27019`).

## Instalación y ejecución

Desde la raíz del proyecto:

1. Crear el archivo `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

2. Levantar la base de datos MongoDB en segundo plano:

```bash
docker compose up -d
```

3. Instalar las dependencias y arrancar el servidor de desarrollo:

```bash
npm install
npm run dev
```

La API escucha en `http://localhost:3001` de forma predeterminada. Es indispensable que MongoDB esté en ejecución antes de iniciar el servidor; de lo contrario, el proceso abortará al arrancar.

Para compilar y ejecutar la versión compilada:

```bash
npm run build
npm run start
```

## Variables de entorno

Los scripts `npm run dev` y `npm run start` cargan automáticamente el archivo `.env` si existe (`--env-file-if-exists=.env`):

- `PORT`: puerto HTTP del servidor (valor por defecto: `3001`).
- `MONGODB_URI`: URI de conexión a MongoDB (valor por defecto: `mongodb://localhost:27019/notas-api`).

## Scripts

- `npm run dev`: inicia el servidor de desarrollo con recarga automática (carga `.env` si existe).
- `npm run build`: compila TypeScript en `dist/`.
- `npm run start`: inicia el servidor compilado desde `dist/index.js` (carga `.env` si existe; `npm start` también funciona).

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

# Spec 001 — Infraestructura MongoDB (Docker Compose y variables de entorno)

## 1. Objetivo
Dotar al proyecto `notas-api` de la infraestructura local de base de datos MongoDB mediante Docker Compose en el puerto `27019` del host, junto con la plantilla de variables de entorno (`.env.example`) y la exclusión de `.env` en `.gitignore`.

## 2. Alcance
- **Crear `docker-compose.yml`** en la raíz del proyecto con:
  - Servicio para MongoDB (imagen oficial `mongo`).
  - Mapeo de puertos `27019:27017` (host `27019` → contenedor `27017`).
  - Volumen nombrado para persistir los datos de `/data/db` entre reinicios del contenedor.
- **Crear `.env.example`** en la raíz del proyecto documentando las variables requeridas:
  - `PORT=3001`
  - `MONGODB_URI=mongodb://localhost:27019/notas-api`
- **Verificar `.gitignore`**:
  - Confirmar que `.env` está presente en `.gitignore` (actualmente ya figura en la línea 3 de `.gitignore`; mantenerlo sin regresiones).

## 3. Fuera de alcance
- Instalación de dependencias en `package.json` (`mongoose`, `dotenv`, etc.).
- Código de conexión a MongoDB dentro de `src/`.
- Modificación de modelos, rutas o lógica de negocio existente.
- Actualización de `README.md` (corresponde a Kevin al cierre si aplica).

## 4. Criterios de aceptación (verificables por Dwight)
1. **Archivo `docker-compose.yml`**: existe en la raíz del repositorio, define el servicio de MongoDB expone el puerto `27019:27017` y declara un volumen de persistencia.
2. **Validación de Docker Compose**: `docker compose config` se ejecuta sin errores de sintaxis y `docker compose up -d` levanta el contenedor aceptando conexiones en `localhost:27019`.
3. **Archivo `.env.example`**: existe en la raíz e incluye la variable de conexión apuntando al puerto `27019` (`mongodb://localhost:27019/...`).
4. **Exclusión en Git**: `.gitignore` incluye `.env` y cualquier archivo `.env` local queda ignorado por Git (`git check-ignore .env` devuelve éxito).
5. **Integridad del build**: `npm run build` termina con código `0` sin cambios en `src/` ni en `package.json`.

## 5. Riesgos y decisiones abiertas
- **[Pregunta abierta 1 — Imagen y versión de Mongo]**: ¿Se fija una versión mayor concreta en `docker-compose.yml` (p. ej. `mongo:7`) para evitar roturas por cambios en `latest`? *(Recomendado: `mongo:7`)*.
- **[Pregunta abierta 2 — Autenticación local]**: ¿El contenedor de desarrollo debe levantarse sin autenticación (`mongodb://localhost:27019/notas-api`) o se requieren credenciales `MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD`? *(Recomendado: sin credenciales para desarrollo local)*.
- **[Pregunta abierta 3 — Nombre de la variable de entorno]**: ¿Confirmamos el nombre `MONGODB_URI` en `.env.example`?

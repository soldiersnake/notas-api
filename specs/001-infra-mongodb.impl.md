# Implementación Spec 001 — Infraestructura MongoDB

## Resumen de cambios
- Creado `docker-compose.yml` con el servicio `mongodb` usando la imagen oficial `mongo:7`, asignado al puerto `27019:27017` del host y volumen persistente `mongo-data`.
- Creado `.env.example` con la plantilla de variables requeridas (`PORT=3001` y `MONGODB_URI=mongodb://localhost:27019/notas-api`).
- Verificado `.gitignore` asegurando que `.env` queda ignorado por Git.

## Verificación realizada
- `docker compose config` sin errores.
- `docker compose up -d` ejecutado con éxito, contenedor `notas-api-mongodb` en ejecución.
- Verificada respuesta del servicio en `localhost:27019`.
- `git check-ignore .env` validado con código 0.

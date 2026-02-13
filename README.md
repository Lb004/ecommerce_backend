# Ecommerce Backend - Entrega Final

Backend con arquitectura por capas para ecommerce usando **DAO + Repository + Services + DTO + Middlewares**.

## Requisitos implementados

- Patrón **Repository** sobre DAOs Mongo.
- Ruta `/api/sessions/current` devolviendo **DTO sin datos sensibles**.
- Recuperación de contraseña con token de 1 hora y bloqueo de reutilización de la contraseña anterior.
- Middleware de autorización por roles integrado con estrategia Passport **current**.
- Endpoints de productos restringidos a admin.
- Agregado de productos al carrito restringido a user.
- Lógica de compra con control de stock y generación de ticket.

## Estructura

- `src/dao/mongo/*`: acceso a datos.
- `src/repositories/*`: capa repository.
- `src/services/*`: lógica de negocio.
- `src/dto/*`: objetos de transferencia.
- `src/middlewares/*`: autorización por roles.
- `src/routes/*`: rutas HTTP.
- `src/models/*`: modelos mongoose.

## Variables de entorno

Se incluye `.env` para facilitar la corrección docente.

```env
MONGO_URL=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=secreto_super_seguro
PORT=8080
APP_BASE_URL=http://localhost:8080
GMAIL_USER=tu_email@gmail.com
GMAIL_PASS=tu_app_password
```

## Scripts

```bash
npm run dev
```

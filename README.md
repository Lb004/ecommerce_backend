# 🛒 E-Commerce Backend - Sistema de Autenticación JWT

## 📝 Descripción del Proyecto

Este proyecto implementa un sistema completo de **autenticación y autorización** para una aplicación de e-commerce. Desarrollado como parte del curso de Backend en Coderhouse, demuestra el uso de tecnologías modernas para crear APIs seguras con Node.js, Express, MongoDB y JWT.

## 🎯 Objetivo

Crear un CRUD de usuarios con un sistema robusto de autenticación utilizando **JSON Web Tokens (JWT)** y **Passport**, garantizando la seguridad mediante encriptación de contraseñas con **bcrypt**.

## 🛠️ Tecnologías Utilizadas

- **Node.js** v18+ - Entorno de ejecución de JavaScript
- **Express** v5.2.1 - Framework web minimalista y flexible
- **MongoDB** v8.2.3 - Base de datos NoSQL
- **Mongoose** v9.1.4 - ODM para MongoDB
- **Passport** v0.7.0 - Middleware de autenticación
- **Passport-JWT** v4.0.1 - Estrategia JWT para Passport
- **bcrypt** v6.0.0 - Librería de encriptación de contraseñas
- **jsonwebtoken** v9.0.3 - Implementación de JWT
- **dotenv** v17.2.3 - Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de conexión a MongoDB
│   │   └── passport.js          # Configuración de estrategias de Passport
│   ├── models/
│   │   └── user.model.js        # Modelo de datos del usuario
│   ├── routes/
│   │   ├── users.router.js      # Endpoints de gestión de usuarios
│   │   └── sessions.router.js   # Endpoints de autenticación
│   ├── utils/
│   │   ├── hash.js              # Funciones de encriptación con bcrypt
│   │   └── jwt.js               # Funciones de generación de JWT
│   └── app.js                   # Punto de entrada de la aplicación
├── .env                         # Variables de entorno (no incluido en repo)
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts
└── README.md                    # Este archivo
```

## 🔐 Implementación Paso a Paso

### Paso 1: Modelo de Usuario

**Archivo:** `src/models/user.model.js`

Se creó el modelo de datos para los usuarios con los siguientes campos:

```javascript
{
  first_name: String (requerido)      // Nombre del usuario
  last_name: String (requerido)       // Apellido del usuario
  email: String (único, requerido)    // Email (usado para login)
  age: Number (opcional)              // Edad del usuario
  password: String (requerido)        // Contraseña hasheada
  cart: ObjectId (referencia)         // Carrito de compras
  role: String (default: 'user')      // Rol del usuario
}
```

**Características:**
- ✅ Email único mediante índice en MongoDB
- ✅ Validaciones de campos requeridos
- ✅ Referencia a colección de Carts para futuras implementaciones
- ✅ Sistema de roles para control de acceso

### Paso 2: Encriptación de Contraseñas

**Archivo:** `src/utils/hash.js`

Implementación de funciones para manejar contraseñas de forma segura:

```javascript
// Encriptar contraseña
createHash(password) 
  → Usa bcrypt.hashSync con 10 rondas de salt
  → Retorna hash: "$2b$10$..."

// Validar contraseña
isValidPassword(user, password)
  → Compara password en texto plano con hash almacenado
  → Retorna true/false
```

**Seguridad:**
- ✅ 10 rondas de salt para protección contra ataques de fuerza bruta
- ✅ Contraseñas nunca almacenadas en texto plano
- ✅ Hash diferente incluso para contraseñas idénticas

### Paso 3: Configuración de Passport

**Archivo:** `src/config/passport.js`

Se configuró Passport con la estrategia JWT:

```javascript
Estrategia: "jwt"
Extracción: Authorization Header (Bearer Token)
Validación: Busca usuario por ID en el payload del JWT
Secret: process.env.JWT_SECRET
```

**Flujo de autenticación:**
1. Cliente envía request con header `Authorization: Bearer <token>`
2. Passport extrae el token del header
3. Verifica firma del token con el secret
4. Decodifica payload y obtiene ID del usuario
5. Busca usuario en MongoDB
6. Adjunta usuario a `req.user` si es válido

### Paso 4: Sistema de Registro

**Archivo:** `src/routes/users.router.js`

Endpoint: `POST /api/users`

**Proceso de registro:**

```
1. Recibe datos del usuario (first_name, last_name, email, password, age)
2. Valida que todos los campos requeridos estén presentes
3. Valida formato de email con regex
4. Valida que la contraseña tenga al menos 6 caracteres
5. Verifica que el email no esté registrado
6. Encripta la contraseña usando bcrypt
7. Crea el usuario en MongoDB
8. Retorna usuario sin el campo password
```

**Validaciones implementadas:**
- ✅ Campos requeridos presentes
- ✅ Formato de email válido
- ✅ Password de al menos 6 caracteres
- ✅ Email único (no duplicados)
- ✅ Edad válida (si se proporciona)

### Paso 5: Sistema de Login

**Archivo:** `src/routes/sessions.router.js`

Endpoint: `POST /api/sessions/login`

**Proceso de login:**

```
1. Recibe email y password
2. Busca usuario por email en MongoDB
3. Valida que el usuario exista
4. Compara password con hash usando bcrypt
5. Genera token JWT con datos del usuario
6. Retorna token al cliente
```

**Token JWT generado:**
```javascript
Payload: {
  id: usuario._id,
  email: usuario.email,
  role: usuario.role
}
Expiración: 1 hora
Algoritmo: HS256
```

### Paso 6: Generación de JWT

**Archivo:** `src/utils/jwt.js`

La función `generateToken()` crea un token firmado con:

```javascript
- Payload: información del usuario (id, email, role)
- Secret: clave secreta desde variables de entorno
- Opciones: expiración de 1 hora
```

**Seguridad del token:**
- ✅ Firmado con secret (no puede ser modificado)
- ✅ Expira automáticamente después de 1 hora
- ✅ Contiene solo información necesaria (no password)

### Paso 7: Ruta Protegida /current

**Archivo:** `src/routes/sessions.router.js`

Endpoint: `GET /api/sessions/current`

**Características:**
- 🔒 Requiere autenticación (middleware de Passport)
- ✅ Valida token JWT automáticamente
- ✅ Retorna datos del usuario sin password

**Proceso:**
```
1. Cliente envía request con Authorization header
2. Passport valida el token JWT
3. Si token válido → extrae usuario y continúa
4. Si token inválido/expirado → retorna 401 Unauthorized
5. Retorna información del usuario sin campo password
```

### Paso 8: Conexión a MongoDB

**Archivo:** `src/config/database.js`

Se configuró la conexión a MongoDB usando Mongoose:

```javascript
- URL: mongodb://127.0.0.1:27017/ecommerce
- Base de datos: ecommerce
- Colección: users
- Manejo de errores en la conexión
```

### Paso 9: Configuración de Variables de Entorno

**Archivo:** `.env`

Variables configuradas:
```
MONGO_URL=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=secreto_super_seguro
PORT=8080
```

**Importante:** El archivo `.env` NO debe subirse a GitHub (incluido en `.gitignore`)

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js v18 o superior
- MongoDB instalado y corriendo
- Git (para clonar el repositorio)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd ecommerce

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env con:
MONGO_URL=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=tu_clave_secreta_aqui
PORT=8080

# 4. Asegurarse de que MongoDB esté corriendo
# En Windows: usar MongoDB Compass o ejecutar mongod
# En Mac/Linux: sudo systemctl start mongod

# 5. Iniciar el servidor
npm run dev
```

### Servidor Activo

Si todo está correcto, deberías ver:
```
🚀 Servidor activo en puerto 8080
✅ Conectado a MongoDB
```

## 📡 API Endpoints

### 1. Registrar Usuario

**Endpoint:** `POST /api/users`

**Request:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user"
  }
}
```

### 2. Iniciar Sesión

**Endpoint:** `POST /api/sessions/login`

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login correcto",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Obtener Usuario Actual

**Endpoint:** `GET /api/sessions/current`

**Headers:**
```
Authorization: Bearer <token-jwt>
```

**Response (200):**
```json
{
  "user": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": null
  }
}
```

## 🧪 Pruebas

### Usando cURL

```bash
# Registrar usuario
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@test.com","age":25,"password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Obtener usuario actual (reemplazar TOKEN)
curl -X GET http://localhost:8080/api/sessions/current \
  -H "Authorization: Bearer <TOKEN>"
```

### Usando Postman

1. Importar la colección incluida en el repositorio
2. Ejecutar "Registrar Usuario"
3. Ejecutar "Login" (el token se guarda automáticamente)
4. Ejecutar "Obtener Usuario Actual"

## 🔒 Seguridad Implementada

### Contraseñas
- ✅ Encriptación con bcrypt (10 rondas de salt)
- ✅ Nunca almacenadas en texto plano
- ✅ No expuestas en respuestas de la API

### Tokens JWT
- ✅ Firmados con secret (imposible de falsificar sin la clave)
- ✅ Expiración de 1 hora
- ✅ Validación automática en rutas protegidas

### Validaciones
- ✅ Formato de email
- ✅ Longitud mínima de contraseña
- ✅ Email único en la base de datos
- ✅ Campos requeridos verificados

### Headers de Seguridad
- ✅ CORS deshabilitado por defecto
- ✅ Autenticación Bearer Token estándar

## 📊 Flujo de Autenticación Completo

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /api/users
       │    {email, password, ...}
       ▼
┌─────────────────┐
│  users.router   │
│  - Valida datos │
│  - Hash password│──────┐
│  - Crea usuario │      │
└────────┬────────┘      │
         │               │
         │ 2. Usuario    │
         │    creado     │
         ▼               │
┌─────────────┐          │
│   MongoDB   │◄─────────┘
│  (password: │
│   $2b$10$...│
└──────┬──────┘
       │
       │ 3. POST /api/sessions/login
       │    {email, password}
       ▼
┌─────────────────┐
│sessions.router  │
│ - Busca usuario │
│ - Valida pass   │
│ - Genera JWT    │
└────────┬────────┘
         │
         │ 4. Retorna token
         ▼
┌─────────────┐
│   Cliente   │
│ (guarda JWT)│
└──────┬──────┘
       │
       │ 5. GET /api/sessions/current
       │    Header: Bearer <token>
       ▼
┌─────────────────┐
│    Passport     │
│ - Verifica JWT  │
│ - Busca usuario │
└────────┬────────┘
         │
         │ 6. Usuario validado
         ▼
┌─────────────┐
│   Cliente   │
│ (recibe     │
│  datos)     │
└─────────────┘
```

## ✅ Cumplimiento de la Consigna

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| Modelo User con campos especificados | ✅ | `src/models/user.model.js` |
| Encriptación con bcrypt.hashSync | ✅ | `src/utils/hash.js` |
| Estrategias de Passport | ✅ | `src/config/passport.js` |
| Sistema de login con JWT | ✅ | `src/routes/sessions.router.js` |
| Ruta /api/sessions/current | ✅ | `src/routes/sessions.router.js` |
| Validación de usuario logueado | ✅ | Middleware de Passport |

## 🎓 Conceptos Aprendidos

Durante el desarrollo de este proyecto se aplicaron los siguientes conceptos:

1. **Autenticación vs Autorización**
   - Autenticación: verificar identidad (login)
   - Autorización: verificar permisos (roles)

2. **Hashing de Contraseñas**
   - Diferencia entre encriptación y hashing
   - Uso de salt para mayor seguridad
   - Comparación segura de contraseñas

3. **JSON Web Tokens (JWT)**
   - Estructura: Header.Payload.Signature
   - Stateless authentication
   - Expiración de tokens

4. **Passport.js**
   - Middleware de autenticación
   - Estrategias intercambiables
   - Integración con Express

5. **Mongoose ODM**
   - Modelos y esquemas
   - Validaciones
   - Índices únicos

6. **Express Middleware**
   - Orden de ejecución
   - Manejo de errores
   - Rutas protegidas

## 🚧 Mejoras Futuras

Posibles extensiones del proyecto:

- [ ] Implementar refresh tokens
- [ ] Agregar recuperación de contraseña
- [ ] Sistema de verificación de email
- [ ] Rate limiting para prevenir ataques de fuerza bruta
- [ ] Implementar OAuth (Google, Facebook)
- [ ] Agregar roles y permisos más granulares
- [ ] Logging de actividad de usuarios
- [ ] Tests unitarios y de integración

## 📝 Notas Importantes

- Las contraseñas se encriptan con **10 rondas de salt** en bcrypt
- Los tokens JWT **expiran en 1 hora**
- El campo `password` **nunca** se retorna en las respuestas
- El archivo `.env` **debe estar en .gitignore**
- MongoDB debe estar **corriendo** antes de iniciar la aplicación

## 👨‍💻 Autor

**Lucas** - Proyecto desarrollado para el curso de Backend en Coderhouse

## 📄 Licencia

Este proyecto es de uso educativo.

---

**Fecha de desarrollo:** Enero 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Producción

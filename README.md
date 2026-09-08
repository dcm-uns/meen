# 🎬 Muviserch - Buscador de Películas TADWeb

Aplicación web para búsqueda y gestión de películas en una base de datos MongoDB. Desarrollada como ejercicio educativo de arquitectura en capas y modularización.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Reference](#api-reference)
- [Para Estudiantes](#para-estudiantes)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ Búsqueda de películas en base de datos MongoDB
- ✅ Agregar nuevas películas a la colección
- ✅ Validación de datos con Joi
- ✅ Configuración centralizada (variables de entorno)
- ✅ Arquitectura modularizada en capas (controller → service → data)
- ✅ Documentación completa con JSDoc
- ✅ Frontend intuitivo con HTML5/CSS/JavaScript vanilla

---

## 🔧 Requisitos

### Antes de empezar necesitas:

- **Node.js**: Versión 12.x o superior
  - Descarga desde [nodejs.org](https://nodejs.org)
  - Verifica: `node --version`

- **npm**: Incluido con Node.js
  - Verifica: `npm --version`

- **MongoDB**: Versión 3.x o superior
  - Opción 1: Instalar localmente en `localhost:27017`
    - Windows: [MongoDB Community Edition](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
    - macOS: `brew install mongodb-community`
    - Linux: Ver [docs oficiales](https://docs.mongodb.com/manual/installation/)
  
  - Opción 2: Usar MongoDB Atlas (nube)
    - Crea una cuenta en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
    - Obtén tu connection string
    - Configura en `.env` (ver [Configuración](#configuración))

---

## 🚀 Instalación

### Paso 1: Clonar o descargar el repositorio

```bash
git clone <url-del-repositorio>
cd meen
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalará:
- `express`: Framework web
- `mongodb`: Driver de MongoDB
- `joi`: Validación de esquemas
- `body-parser`: Parseo de JSON
- `dotenv`: Manejo de variables de entorno (si se agrega)

### Paso 3: Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Luego edita `.env` con tus valores (ver siguiente sección).

### Paso 4: Preparar la base de datos

#### Opción A: MongoDB Local

1. **Inicia MongoDB**:
   - Windows: Ejecuta `mongod.exe` (o `brew services start mongodb-community` en macOS)
   - Deberías ver: `"Waiting for connections on port 27017"`

2. **Crea la base de datos y colección** usando MongoDB Shell:
   ```bash
   # En otra terminal, abre mongo
   mongosh
   
   # Dentro de mongo shell
   use sample_mflix
   db.movies.insertMany([
     { title: "Toy Story", plot: "A cowboy...", year: 1995 },
     { title: "Toy Story 2", plot: "Woody...", year: 1999 },
     { title: "Avatar", plot: "A paraplegic Marine...", year: 2009 }
   ])
   
   # Verifica
   db.movies.find().pretty()
   ```

#### Opción B: MongoDB Atlas (nube)

1. Crea una cuenta y cluster en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Obtén tu connection string: `mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority`
3. Reemplaza en `.env`:
   ```
   MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=sample_mflix
   ```
4. Crea la colección `movies` con los mismos datos

### Paso 5: Ejecutar la aplicación

```bash
# Desarrollo simple
npm start

# O con recarga automática (si tienes nodemon instalado)
npx nodemon
```

Deberías ver:
```
Conectado a MongoDB: sample_mflix
Starting server on http://localhost:3000
```

Abre tu navegador en `http://localhost:3000` y ¡listo! 🎉

---

## ⚙️ Configuración

### Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto:

```env
# MongoDB
MONGO_URL=mongodb://127.0.0.1:27017
DB_NAME=sample_mflix

# Servidor Express
PORT=3000
HOST=localhost
```

### Explicación de cada variable:

| Variable | Descripción | Valor por defecto |
|----------|------------|-------------------|
| `MONGO_URL` | URL de conexión a MongoDB | `mongodb://127.0.0.1:27017` |
| `DB_NAME` | Nombre de la base de datos | `sample_mflix` |
| `PORT` | Puerto donde escucha Express | `3000` |
| `HOST` | Host del servidor | `localhost` |

**Nota**: Si no existe `.env`, la aplicación usará los valores por defecto (perfectamente válidos para desarrollo local).

---

## 📁 Estructura del Proyecto

```
meen/
├── config.js                    # ⚙️ Configuración centralizada
├── index.js                     # 🚀 Punto de entrada (inicia servidor)
├── db.js                        # 🔌 Conexión a MongoDB
├── routes.js                    # 🛣️ Definición de rutas API
│
├── services/
│   └── movieService.js          # 🎯 Lógica de CRUD de películas
│
├── validators/
│   └── movieValidator.js        # ✅ Validación con Joi
│
├── public/
│   ├── index.html               # 📄 Página principal
│   ├── clicks.js                # 🖱️ Controlador de eventos
│   └── style.css                # 🎨 Estilos
│
├── .env.example                 # 📝 Plantilla de variables
├── .gitignore                   # 🚫 Archivos ignorados por git
├── package.json                 # 📦 Dependencias
└── README.md                    # 📚 Este archivo
```

### Responsabilidad de cada archivo:

| Archivo | Responsabilidad |
|---------|-----------------|
| `config.js` | Centraliza configuración (BD, puerto, etc.) |
| `index.js` | Inicia servidor Express y DB |
| `db.js` | Maneja conexión a MongoDB |
| `routes.js` | Define endpoints GET/POST |
| `services/movieService.js` | Lógica pura: búsqueda, inserción |
| `validators/movieValidator.js` | Valida datos con Joi |
| `public/index.html` | Interfaz web del usuario |
| `public/clicks.js` | Eventos del frontend (búsqueda, agregar) |

---

## 🔗 API Reference

### GET /peliculas

**Obtiene películas de la base de datos**

#### Request:
```http
GET /peliculas?title=Avatar
```

#### Response (200 OK):
```json
[
  { "title": "Toy Story" },
  { "title": "Toy Story 2" }
]
```

#### Errores:
- `500`: Error al conectar con la BD

#### Notas:
- ⚠️ **IMPORTANTE**: El parámetro `title` se IGNORA actualmente.
- El servidor devuelve SIEMPRE películas con "Toy" en el título.
- Esto es intencional (ejercicio para estudiantes).
- Ver sección [Para Estudiantes](#para-estudiantes).

---

### POST /peliculas

**Agrega una nueva película a la base de datos**

#### Request:
```http
POST /peliculas
Content-Type: application/json

{
  "title": "Inception",
  "plot": "A thief who steals corporate secrets through dream-sharing...",
  "year": 2010
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "message": "Película añadida correctamente"
}
```

#### Errores (400 Bad Request):
```json
{
  "error": "Datos inválidos",
  "message": "El título es requerido, La sinopsis es requerida",
  "details": [...]
}
```

#### Validación:
- `title`: String, mínimo 1 carácter, requerido
- `plot`: String, mínimo 1 carácter, requerido
- `year`: Número, mínimo 1, requerido

---

## 🎓 Para Estudiantes

### 🐛 El Ejercicio Intencional: El Filtro Hardcodeado

La aplicación tiene un **bug intencional** diseñado para enseñanza:

**Problema**: No importa qué busques, siempre devuelve películas con "Toy".

**Ubicación**: En `services/movieService.js`, línea ~28-35

**¿Dónde buscar?**:
```javascript
// ⚠️ AQUÍ ESTÁ EL HARDCODEADO
const filter = {
  'title': { $regex: /Toy/ }
}
// Los estudiantes deben reemplazar /Toy/ por la búsqueda real
```

**Tu misión**:
1. Abre `services/movieService.js`
2. Encuentra donde está definido `const filter`
3. Reemplaza el regex hardcodeado `/Toy/` para que use el parámetro `searchQuery`
4. **Pista**: Puedes usar `new RegExp(searchQuery, 'i')` para búsqueda insensible a mayúsculas
5. Prueba: busca "Avatar" y deberías obtener películas de Avatar, no Toy Story

**Código de solución** (no lo mires si prefieres resolver por tu cuenta):
```javascript
// ANTES (incorrecto)
const filter = { 'title': { $regex: /Toy/ } }

// DESPUÉS (correcto)
const filter = { 'title': { $regex: new RegExp(searchQuery, 'i') } }
```

---

### 🏗️ Arquitectura en Capas

Esta aplicación demuestra **separación de responsabilidades**:

```
┌─────────────────┐
│   Frontend      │  (HTML/JS en public/)
│  (Interfaz)     │
└────────┬────────┘
         │ fetch() HTTP
┌────────▼────────┐
│   API Routes    │  (routes.js)
│  (Endpoints)    │  - GET /peliculas
└────────┬────────┘  - POST /peliculas
         │
┌────────▼────────┐
│   Validators    │  (validators/movieValidator.js)
│  (Validación)   │  - validateMovie()
└────────┬────────┘
         │
┌────────▼────────┐
│   Services      │  (services/movieService.js)
│  (Lógica CRUD)  │  - searchMovies()
└────────┬────────┘  - addMovie()
         │
┌────────▼────────┐
│   Database      │  (db.js + MongoDB)
│  (Persistencia) │
└─────────────────┘
```

### 💡 Ejercicios Adicionales

**Nivel 1 - Fácil**:
- Modifica el CSS para que sea más vistoso
- Agrega un campo adicional (director, actores) al formulario

**Nivel 2 - Medio**:
- Implementa búsqueda por año: `GET /peliculas?year=2009`
- Agrega paginación: `GET /peliculas?limit=10&skip=0`
- Crea endpoint para eliminar película: `DELETE /peliculas/:id`

**Nivel 3 - Avanzado**:
- Implementa autenticación (JWT)
- Agrega búsqueda full-text en MongoDB
- Deploy a Heroku o AWS

---

## 🔍 Estructura de Datos MongoDB

### Colección: `movies`

Cada documento tiene esta estructura:

```json
{
  "_id": ObjectId("..."),
  "title": "Avatar",
  "plot": "A paraplegic Marine...",
  "year": 2009,
  // pueden haber otros campos
}
```

### Campos documentados:
- `_id`: ID único auto-generado por MongoDB
- `title`: Título de la película (String)
- `plot`: Sinopsis (String)
- `year`: Año de lanzamiento (Number)

---

## 🐛 Troubleshooting

### "Cannot find module 'mongodb'"
**Solución**: Ejecuta `npm install`

### "Connection refused on 127.0.0.1:27017"
**Solución**: 
- Verifica que MongoDB esté ejecutándose
- Windows: Busca "Services" y activa "MongoDB"
- macOS/Linux: `brew services start mongodb-community` o equivalente

### "Database 'sample_mflix' not found"
**Solución**:
- La BD se crea automáticamente
- Pero necesitas la colección `movies` con datos
- Ver sección [Preparar la base de datos](#paso-4-preparar-la-base-de-datos)

### "POST retorna 400 - Datos inválidos"
**Solución**:
- Verifica que incluyas los campos requeridos: `title`, `plot`, `year`
- Verifica que `year` sea un número válido (no string)
- Check la consola del servidor para detalles del error

### El servidor no inicia
**Solución**:
- Verifica el puerto no esté en uso: `netstat -an | grep 3000` (macOS/Linux) o `netstat -an | find "3000"` (Windows)
- Cambia el puerto en `.env`: `PORT=3001`

---

## 📚 Recursos Útiles

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Joi Validation](https://joi.dev)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 📝 Notas para Instructores

Esta estructura está diseñada para enseñanza:

1. **Bug Intencional**: El filtro hardcodeado en `searchMovies()` es un ejercicio perfecto para que los estudiantes identifiquen y corrijan problemas.

2. **Modularización**: Cada capa tiene responsabilidad clara, facilitando comprensión y testing.

3. **Documentación**: JSDoc completo en cada función y archivo.

4. **Escalabilidad**: Estructura preparada para que los estudiantes agreguen features.

---

## 📄 Licencia

Este proyecto es de uso educativo. Libre para modificar y distribuir en contexto académico.


/**
 * @fileoverview Punto de entrada de la aplicación
 * Inicializa Express, conecta a MongoDB y arranca el servidor
 */

const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const { init } = require('./db')
const routes = require('./routes')

// Creamos la aplicación Express (nuestro servidor)
const app = express()

// Middleware para parsear JSON
app.use(bodyParser.json())

// Añadimos las rutas de API
app.use(routes)

// Añadimos archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static("public"))

/**
 * Inicia el servidor después de conectar a MongoDB
 */
init()
  .then(() => {
    const host = config.server.host
    const port = config.server.port
    const url = `http://${host}:${port}`
    
    console.log(`🚀 Starting server on ${url}`)
    console.log(`📂 Serving static files from: ./public`)
    console.log(`💾 Connected to MongoDB: ${config.mongo.dbName}`)
    
    app.listen(port, host)
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  })

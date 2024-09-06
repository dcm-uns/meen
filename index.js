const express = require('express')
const bodyParser = require('body-parser')
const { init } = require('./db')
const routes = require('./routes')

// Creamos la aplicación Express (nuestro servidor)
const app = express()
app.use(bodyParser.json())
// Añadimos las rutas
app.use(routes)
// Añadimos el directorio publico, aquello que será entregado sin mas procesamiento
app.use(express.static("public"));

init().then(() => {
  console.log('Starting server on http://localhost:3000')
  app.listen(3000)
})

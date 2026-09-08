/**
 * @fileoverview Inicialización de conexión a MongoDB
 * Este módulo gestiona la conexión inicial a la base de datos MongoDB.
 * La configuración se centraliza en config.js
 * Las operaciones CRUD se encuentran en services/movieService.js
 */

const { MongoClient } = require('mongodb')
const config = require('./config')
const movieService = require('./services/movieService')

let client

/**
 * Inicializa la conexión a MongoDB
 * Lee la configuración desde config.js (que a su vez lee variables de entorno)
 * Luego inicializa el servicio de películas con la referencia a la BD
 * 
 * @returns {Promise<void>}
 * @throws {Error} Si no puede conectar a MongoDB
 * 
 * @example
 * init()
 *   .then(() => console.log('Conectado a MongoDB'))
 *   .catch(err => console.error('Error de conexión:', err))
 */
const init = async () => {
  try {
    client = await MongoClient.connect(
      config.mongo.connectionUrl,
      config.mongoOptions
    )
    
    const db = client.db(config.mongo.dbName)
    
    // Inicializar el servicio de películas con la conexión
    movieService.setDatabase(db)
    
    console.log(`Conectado a MongoDB: ${config.mongo.dbName}`)
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    throw error
  }
}

/**
 * Cierra la conexión a MongoDB de forma limpia
 * Llamar esto al apagar el servidor
 * 
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  if (client) {
    await client.close()
    console.log('Conexión a MongoDB cerrada')
  }
}

// Re-exportar funciones del servicio para mantener compatibilidad
const insertItem = movieService.addMovie
const getPelis = movieService.searchMovies

module.exports = {
  init,
  closeConnection,
  insertItem,
  getPelis
}
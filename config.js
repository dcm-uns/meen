/**
 * @fileoverview Configuración centralizada de la aplicación
 * Todos los parámetros configurables en un único lugar.
 * Soporta variables de entorno con valores por defecto.
 */

// Intenta cargar dotenv, pero no falla si no está disponible
try {
  require('dotenv').config()
} catch (e) {
  // dotenv es opcional - si no está instalado, usa variables de entorno del sistema
  console.warn('⚠️  dotenv no está instalado. Asegúrate de ejecutar: npm install')
}

module.exports = {
  /**
   * Configuración de MongoDB
   */
  mongo: {
    /**
     * URL de conexión a MongoDB
     * Variable de entorno: MONGO_URL
     * Valor por defecto: mongodb://127.0.0.1:27017
     */
    connectionUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',

    /**
     * Nombre de la base de datos
     * Variable de entorno: DB_NAME
     * Valor por defecto: sample_mflix
     */
    dbName: process.env.DB_NAME || 'sample_mflix',

    /**
     * Nombre de la colección de películas
     * Valor fijo: movies
     */
    collectionName: 'movies'
  },

  /**
   * Configuración del servidor Express
   */
  server: {
    /**
     * Puerto donde escucha el servidor
     * Variable de entorno: PORT
     * Valor por defecto: 3000
     */
    port: process.env.PORT || 3000,

    /**
     * Host donde escucha el servidor
     * Variable de entorno: HOST
     * Valor por defecto: localhost
     */
    host: process.env.HOST || 'localhost'
  },

  /**
   * Opciones de conexión a MongoDB
   */
  mongoOptions: {
    useNewUrlParser: true
  }
}

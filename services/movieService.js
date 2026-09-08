/**
 * @fileoverview Servicio de películas - Capa de datos
 * Centraliza toda la lógica de interacción con la colección 'movies' en MongoDB.
 * Este módulo actúa como intermediario entre las rutas y la base de datos.
 */

const config = require('../config')

let db

/**
 * Inicializa la referencia a la base de datos
 * Debe ser llamado después de conectar a MongoDB
 * @param {Object} database - Instancia de la base de datos MongoDB
 */
const setDatabase = (database) => {
  db = database
}

/**
 * Obtiene las películas según un criterio
 * 
 * ⚠️ IMPORTANTE: El filtro está HARDCODEADO a películas con "Toy" en el título
 * Esta es una limitación intencional que los estudiantes deben identificar y corregir.
 * 
 * El parámetro searchQuery se ignora actualmente (esto es parte del ejercicio).
 * 
 * @param {string} searchQuery - Término de búsqueda (actualmente ignorado - ejercicio para estudiantes)
 * @returns {Promise<Array>} Array de películas con título
 * 
 * @example
 * // Estudiantes: ¿Por qué siempre devuelve "Toy" aunque pases otro parámetro?
 * // Busca dónde está el filtro hardcodeado y corrígelo.
 * searchMovies('Avatar').then(movies => console.log(movies))
 */
const searchMovies = (searchQuery) => {
  // ⚠️ AQUÍ ESTÁ EL HARDCODEADO - Los estudiantes deben reemplazar esto
  const filter = {
    'title': { $regex: /Toy/ }
  }

  const projection = {
    'title': 1,
    '_id': 0
  }

  const collection = db.collection(config.mongo.collectionName)
  const cursor = collection.find(filter, { projection })
  
  return cursor.toArray()
}

/**
 * Inserta una nueva película en la base de datos
 * La película debe estar validada antes de llamar esta función
 * 
 * @param {Object} movieData - Objeto con datos de película (title, plot, year, etc.)
 * @returns {Promise<Object>} Resultado de la inserción (insertedId, etc.)
 * 
 * @example
 * addMovie({ title: 'Avatar', plot: 'Description', year: 2009 })
 *   .then(result => console.log('Insertado:', result.insertedId))
 */
const addMovie = (movieData) => {
  const collection = db.collection(config.mongo.collectionName)
  return collection.insertOne(movieData)
}

/**
 * Obtiene todas las películas sin filtro (útil para administración)
 * @returns {Promise<Array>} Array de todas las películas
 */
const getAllMovies = () => {
  const collection = db.collection(config.mongo.collectionName)
  return collection.find({}).toArray()
}

/**
 * Obtiene películas que coincidan con un filtro personalizado
 * (Función adicional para casos avanzados)
 * 
 * @param {Object} customFilter - Filtro MongoDB personalizado
 * @param {Object} options - Opciones (projection, limit, etc.)
 * @returns {Promise<Array>} Array de películas que coinciden el filtro
 * 
 * @example
 * getMoviesByFilter({ year: { $gte: 2000 } }, { limit: 10 })
 */
const getMoviesByFilter = (customFilter, options = {}) => {
  const collection = db.collection(config.mongo.collectionName)
  const query = collection.find(customFilter)
  
  if (options.limit) {
    query.limit(options.limit)
  }
  if (options.projection) {
    query.project(options.projection)
  }
  
  return query.toArray()
}

module.exports = {
  setDatabase,
  searchMovies,
  addMovie,
  getAllMovies,
  getMoviesByFilter
}

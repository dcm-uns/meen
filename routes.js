/**
 * @fileoverview Definición de rutas API
 * Gestiona los endpoints HTTP para búsqueda y adición de películas
 */

const express = require('express')
const { insertItem, getPelis } = require('./db')
const { validateMovie } = require('./validators/movieValidator')

const router = express.Router()

/**
 * ENDPOINT: GET /public
 * Sirve archivos estáticos desde la carpeta public
 */
router.get('/public', (req, res) => {
  res.sendFile(__dirname + "/public")
})

/**
 * ENDPOINT: GET /peliculas
 * 
 * Obtiene películas de la base de datos.
 * 
 * ⚠️ NOTA IMPORTANTE: Actualmente devuelve SIEMPRE películas con "Toy" en el título,
 * ignorando cualquier parámetro de búsqueda. Esto es un ejercicio intencional.
 * Los estudiantes deben encontrar dónde está el filtro hardcodeado y corregirlo.
 * 
 * @query {string} [title] - Término de búsqueda (actualmente ignorado)
 * 
 * @returns {number} 200 - Array JSON de películas
 * @returns {object[]} Array de películas
 * @returns {string} title - Título de la película
 * 
 * @returns {number} 500 - Error en el servidor
 * 
 * @example
 * GET /peliculas
 * // Response: [{ title: "Toy Story" }, { title: "Toy Story 2" }, ...]
 * 
 * @example
 * GET /peliculas?title=Avatar
 * // Response: [{ title: "Toy Story" }, ...] (ignora el parámetro title)
 */
router.get('/peliculas', (req, res) => {
  getPelis()
    .then((items) => {
      // Mapear solo el título para la respuesta
      items = items.map((item) => ({
        title: item.title
      }))
      res.json(items)
    })
    .catch((err) => {
      console.error('Error al buscar películas:', err)
      res.status(500).json({
        error: 'Error al buscar películas',
        message: err.message
      })
    })
})

/**
 * ENDPOINT: POST /peliculas
 * 
 * Añade una nueva película a la base de datos.
 * 
 * La película debe incluir los campos requeridos:
 * - title (string, no vacío)
 * - plot (string, no vacío)
 * - year (number)
 * 
 * @body {Object} movieData
 * @body {string} movieData.title - Título de la película (requerido)
 * @body {string} movieData.plot - Sinopsis (requerido)
 * @body {number} movieData.year - Año de lanzamiento (requerido)
 * 
 * @returns {number} 201 - Película creada exitosamente
 * @returns {number} 400 - Datos inválidos
 * @returns {number} 500 - Error en el servidor
 * 
 * @example
 * POST /peliculas
 * Content-Type: application/json
 * 
 * {
 *   "title": "Inception",
 *   "plot": "A thief who steals corporate secrets...",
 *   "year": 2010
 * }
 * 
 * Response: 201 Created
 */
router.post('/peliculas', (req, res) => {
  const movieData = req.body
  
  // Validar datos usando el validador centralizado
  const validation = validateMovie(movieData)
  
  if (!validation.success) {
    const errorMessage = validation.error.details
      .map(detail => detail.message)
      .join(', ')
    
    console.log('Error de validación:', errorMessage)
    
    return res.status(400).json({
      error: 'Datos inválidos',
      message: errorMessage,
      details: validation.error.details
    })
  }
  
  // Insertar película en la base de datos
  insertItem(movieData)
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'Película añadida correctamente'
      })
    })
    .catch((err) => {
      console.error('Error al insertar película:', err)
      res.status(500).json({
        error: 'Error al insertar película',
        message: err.message
      })
    })
})

module.exports = router

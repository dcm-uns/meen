/**
 * @fileoverview Validador de películas - Uso de Joi para esquema
 * Centraliza la lógica de validación de datos de películas.
 * Esto separa la preocupación de validación de las rutas.
 */

const Joi = require('joi')

/**
 * Esquema Joi para validación de películas
 * Define la estructura esperada y restricciones
 */
const movieSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'El título no puede estar vacío',
      'any.required': 'El título es requerido'
    }),

  plot: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'La sinopsis no puede estar vacía',
      'any.required': 'La sinopsis es requerida'
    }),

  year: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'El año debe ser un número',
      'any.required': 'El año es requerido'
    })
}).unknown(true) // Permite campos adicionales que se ignorarán

/**
 * Valida los datos de una película contra el esquema
 * 
 * @param {Object} movieData - Datos de la película a validar
 * @returns {Object} Objeto con propiedades:
 *   - error: (Joi.ValidationError | null) Error si hay, null si es válido
 *   - value: (Object) Datos validados
 *   - success: (boolean) true si es válido, false si no
 * 
 * @example
 * const result = validateMovie({ title: 'Avatar', plot: 'Desc', year: 2009 })
 * if (!result.success) {
 *   console.error('Errores:', result.error.message)
 * }
 */
const validateMovie = (movieData) => {
  const result = movieSchema.validate(movieData)
  
  return {
    error: result.error,
    value: result.value,
    success: !result.error
  }
}

/**
 * Valida solo el título de una película (búsqueda)
 * Usado para validar parámetros de búsqueda
 * 
 * @param {string} title - Título a validar
 * @returns {Object} Objeto con propiedades: error, value, success
 * 
 * @example
 * const result = validateSearchTitle('Avatar')
 */
const validateSearchTitle = (title) => {
  const searchSchema = Joi.object({
    title: Joi.string()
      .min(1)
      .allow('')
      .messages({
        'string.empty': 'El título de búsqueda no puede estar vacío'
      })
  })

  const result = searchSchema.validate({ title })
  
  return {
    error: result.error,
    value: result.value,
    success: !result.error
  }
}

module.exports = {
  movieSchema,
  validateMovie,
  validateSearchTitle
}

const express = require('express')
const { insertItem,  getPelis, getPelisT } = require('./db')
const Joi = require('joi')

const router = express.Router()

// Lo que se solicita de la carpeta public, se envía directamente
router.get('/public',(req,res) => {
  res.sendFile(__dirname + "/public");
})

// API para obtener las peliculas solicitadas
// ENDPOINT: GET /peliculas
router.get('/peliculas', (req, res) => {
  getPelis()
    .then((items) => {
      items = items.map((item) => ({
        title: item.title
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

// API para obtener las peliculas solicitadas
// ENDPOINT: POST /peliculas
// Postear una pelicula
router.post('/peliculas', (req, res) => {
  const item = req.body
  console.log(req.body)
  // Validar el item, para que tenga cierta estructura mínima
  // (aquí se puede usar Joi, o cualquier otra librería de validación)
  const itemSchema = Joi.object({
    title: Joi.string().min(1).required(),
    plot: Joi.string().min(1).required(),
    year: Joi.number().min(1).required()
  }).unknown(true) // Permite cualquier campo extra 
  const result = itemSchema.validate(item)
  if (result.error) {
    console.log(result.error)
    res.status(400).end()
    return
  }
  insertItem(item)
    .then(() => {
      res.status(200).end()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})


module.exports = router

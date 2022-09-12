const express = require('express')
const Joi = require('@hapi/joi')
const { insertItem, getItems, getPelis, getPelisT, updateQuantity } = require('./db')

const router = express.Router()

const itemSchema = Joi.object().keys({
  name: Joi.string(),
  quantity: Joi.number().integer().min(0)
})

router.get('/pelis',(req,res) => {
  res.sendFile(__dirname + "/public/index.html");
})

router.get('/public',(req,res) => {
  res.sendFile(__dirname + "/public");
})

router.post('/item', (req, res) => {
  const item = req.body
  console.log(req.body)
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

router.get('/items', (req, res) => {
  getPelis()
    .then((items) => {
      items = items.map((item) => ({
        title: item.title,
        year: item.year
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.get('/items/:titulo', (req, res) => {
  const {titulo} = req.params
  getPelisT(titulo)
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


router.put('/item/:id/quantity/:quantity', (req, res) => {
  const { id, quantity } = req.params
  updateQuantity(id, parseInt(quantity))
    .then(() => {
      res.status(200).end()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

module.exports = router
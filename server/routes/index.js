const express = require('express')
const indexRoute = express.Router()

// get home page
indexRoute.get('/', (request, response, next) => {
  response.render('index', { title: 'Express' })
})

module.exports = indexRoute

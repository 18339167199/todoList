const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res, next) => {
  res.render('404', {
    targer: req.originalUrl
  })
})

module.exports = router

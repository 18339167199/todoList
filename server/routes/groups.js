const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.send({
    error: 0,
    data: [],
    msg: 'ok'
  })
})

module.exports = router

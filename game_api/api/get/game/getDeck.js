const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    console.log(req.query)
    return res.status(200).send({ status: 'OK' })
})

module.exports = router
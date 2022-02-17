const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    return res.status(200).send({status: 'OK'})
})

module.exports = router
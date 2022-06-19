const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    return res.status(200).render('pages/error404')
})

module.exports = router
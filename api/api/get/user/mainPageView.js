const express = require('express')
const router = express.Router()

// Middleware which sends main page
router.get('/', async (req, res) => {
    return res.status(200).render('pages/index')
})

module.exports = router
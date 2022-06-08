const express = require('express')
const router = express.Router()

// Middleware which sends logout page
router.get('/', async (req, res) => {
    return res.status(200).render('pages/logout')
})

module.exports = router
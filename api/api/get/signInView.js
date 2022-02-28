const express = require('express')
const router = express.Router()

// Middleware which sends signin page
router.get('/', async (req, res) => {
    return res.status(200).render('pages/signin')
})

module.exports = router
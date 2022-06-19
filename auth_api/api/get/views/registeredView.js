const express = require('express')
const router = express.Router()

// Middleware which sends registered page with breadcrumbs
router.get('/', async (req, res) => {
    return res.status(200).render('pages/registered')
})

module.exports = router
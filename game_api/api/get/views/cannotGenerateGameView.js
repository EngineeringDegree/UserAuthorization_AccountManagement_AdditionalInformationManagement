const express = require('express')
const router = express.Router()

// Middleware which sends logout page with breadcrumbs
router.get('/', async (req, res) => {
    return res.status(500).render('pages/cannotGenerateGame')
})

module.exports = router
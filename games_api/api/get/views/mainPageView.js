const express = require('express')
const router = express.Router()

// Middleware which sends main page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: true,
            text: 'Home'
        }
    ]
    return res.status(200).render('pages/index', { breadcrumb: breadcrumb })
})

module.exports = router
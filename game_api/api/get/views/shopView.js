const express = require('express')
const router = express.Router()

// Middleware which sends shop page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Shop'
        }
    ]
    return res.status(200).render('pages/shop', { breadcrumb: breadcrumb })
})

module.exports = router
const express = require('express')
const router = express.Router()

// Middleware which sends signin page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Sign In'
        }
    ]
    return res.status(200).render('pages/signin', { breadcrumb: breadcrumb })
})

module.exports = router
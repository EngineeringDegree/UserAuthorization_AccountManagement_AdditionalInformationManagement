const express = require('express')
const router = express.Router()

// Middleware which sends registered page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Account Registered'
        }
    ]
    return res.status(200).render('pages/registered', { breadcrumb: breadcrumb })
})

module.exports = router
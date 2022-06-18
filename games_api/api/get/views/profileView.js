const express = require('express')
const router = express.Router()

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'My profile'
        }
    ]
    return res.status(200).render('pages/profile', { breadcrumb: breadcrumb })
})

module.exports = router
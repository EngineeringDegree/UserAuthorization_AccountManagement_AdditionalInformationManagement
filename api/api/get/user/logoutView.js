const express = require('express')
const router = express.Router()

// Middleware which sends logout page
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Logout'
        }
    ]
    return res.status(200).render('pages/logout', { breadcrumb: breadcrumb })
})

module.exports = router
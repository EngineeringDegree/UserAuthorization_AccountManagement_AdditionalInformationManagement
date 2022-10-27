const express = require('express')
const router = express.Router()

// Middleware which sends logout page with breadcrumbs
router.get('/', async (req, res) => {
    const breadcrumb = [
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
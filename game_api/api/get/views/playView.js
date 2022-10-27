const express = require('express')
const router = express.Router()

// Middleware which sends signin page with breadcrumbs
router.get('/', async (req, res) => {
    const breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Play'
        }
    ]
    return res.status(200).render('pages/play', { breadcrumb: breadcrumb })
})

module.exports = router
const express = require('express')
const router = express.Router()

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    const breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Manage'
        }
    ]
    return res.status(200).render('admin/manage', { breadcrumb: breadcrumb })
})

module.exports = router
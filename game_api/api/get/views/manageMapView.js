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
            currentPage: false,
            text: 'Manage',
            link: '/manage'
        },
        {
            currentPage: true,
            text: 'Maps'
        }
    ]
    return res.status(200).render('admin/manageMap', { breadcrumb: breadcrumb })
})

module.exports = router
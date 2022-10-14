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
            currentPage: false,
            text: 'Manage',
            link: '/manage'
        },
        {
            currentPage: false,
            text: 'Nations',
            link: '/manage/nations'
        },
        {
            currentPage: true,
            text: 'Add Nation'
        }
    ]
    return res.status(200).render('admin/addNation', { breadcrumb: breadcrumb })
})

module.exports = router
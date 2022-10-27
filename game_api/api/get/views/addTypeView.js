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
            currentPage: false,
            text: 'Types',
            link: '/manage/types'
        },
        {
            currentPage: true,
            text: 'Add Type'
        }
    ]
    return res.status(200).render('admin/addType', { breadcrumb: breadcrumb })
})

module.exports = router
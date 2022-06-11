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
            text: 'Maps',
            link: '/manage/map'
        },
        {
            currentPage: true,
            text: 'Add Map'
        }
    ]
    return res.status(200).render('admin/addMap', { breadcrumb: breadcrumb })
})

module.exports = router